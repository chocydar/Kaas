import { useQueryClient } from '@tanstack/react-query';
import { animate, motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { ScrollArea } from '@/components/ui/scroll-area';
import TwoRows from '@/layouts/TwoRows';
import { MESSAGE_BOT, MESSAGE_USER } from '@/lib/constants';
import {
  LIST_MESSAGES_KEY,
  useCallBot,
  useConversationModelUpdater,
  useCreateMessageMutation,
  useListMessagesQuery,
  useSubjectUpdater,
} from '@/lib/hooks';
import log from '@/lib/log';
import { useAppStateStore } from '@/lib/store';
import type {
  ConversationDetails,
  Message,
  Model,
  StatefulDialogHandler,
} from '@/lib/types';
import { cn } from '@/lib/utils';

import { BotMessageReceiver } from './BotMessageReceiver';
import { ChatMessageList } from './ChatMessageList';
import { ChatPromptInput } from './ChatPromptInput';
import { ChatStop } from './ChatStop';
import { ConversationTitleBar } from './ConversationTitleBar';
import { ModelPickerDialog } from './ModelPickerDialog';
import { ScrollBottom } from './ScrollBottom';
import { ToBottom } from './ToBottom';
import { Button } from './ui/button';

const MemoizedMessageList = memo(ChatMessageList);

type Props = {
  conversation: ConversationDetails;
};

export function ChatSection({ conversation }: Props) {
  const [listenerReady, setListenerReady] = useState(false); // mark to make sure listener is ready before calling bot
  const [receiving, setReceiving] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<StatefulDialogHandler<string>>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const model = useAppStateStore((state) =>
    state.models.find((m) => m.id === conversation.modelId)
  );
  const { t } = useTranslation(['page-conversation']);

  // Queries
  const { data: messages, isSuccess } = useListMessagesQuery(conversation.id);
  const callBotMutation = useCallBot();
  const createMsgMutation = useCreateMessageMutation();
  const subjectUpdater = useSubjectUpdater();
  const modelUpdater = useConversationModelUpdater();

  const queryClient = useQueryClient();
  const messagesWithModelId = useMemo(() => {
    return (
      messages?.map((msg) => {
        return {
          ...msg,
          modelId: msg.modelId ? msg.modelId : conversation.modelId,
        };
      }) ?? []
    );
  }, [messages]);

  // Callbacks
  const onNewUserMessage = async (_message: Message) => {
    // call bot
    callBotMutation.mutate(conversation.id, {
      onSuccess: async () => {
        callBotMutation.reset();
      },
      onError: async (error) => {
        const errMsg = `Bot call failed: ${error.message}`;
        await log.error(errMsg);
        toast.error(errMsg);
      },
    });
  };

  const onNewBotMessage = (msg: string) => {
    createMsgMutation.mutate(
      {
        conversationId: conversation.id,
        role: MESSAGE_BOT,
        content: msg,
      },
      {
        onSuccess(message) {
          // Update cache
          queryClient.setQueryData<Message[]>(
            [...LIST_MESSAGES_KEY, { conversationId: conversation.id }],
            (msgList) => (msgList ? [...msgList, message] : [message])
          );
        },
      }
    );
  };

  const onReceivingChange = useCallback(
    (isReceiving: boolean) => setReceiving(isReceiving),
    []
  );

  const onToBottomClick = useCallback(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current?.scrollHeight ?? 0,
        behavior: 'smooth',
      });
    }
  }, []);

  const onTitleChange = useCallback((newTitle: string) => {
    subjectUpdater({ conversationId: conversation.id, subject: newTitle });
  }, []);

  const onChooseClick = useCallback(() => {
    dialogRef.current?.open(conversation.subject);
  }, [dialogRef]);

  const onChooseSubmit = useCallback((selectedModel: Model) => {
    console.log('selected model:', selectedModel);
    modelUpdater({
      conversationId: conversation.id,
      modelId: selectedModel.id,
    });
  }, []);

  useEffect(() => {
    if (isSuccess && messages?.length > 0 && listenerReady) {
      const lastMsg = messages.at(-1);
      if (lastMsg?.role === MESSAGE_USER) {
        onNewUserMessage(lastMsg);
      }
    }
  }, [isSuccess, messages, listenerReady]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.onscroll = () => {
        setAtBottom(
          (viewportRef.current?.scrollTop ?? 0) +
            (viewportRef.current?.clientHeight ?? 0) ===
            viewportRef.current?.scrollHeight
        );
      };
      if (
        (viewportRef.current?.clientHeight ?? 0) ===
        viewportRef.current?.scrollHeight
      ) {
        // clientHeight is less than screen height
        // no scroll bar shown and we're at the bottom
        setAtBottom(true);
      }
    }
  }, [viewportRef.current]);

  useEffect(() => {
    if (!receiving) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (atBottom) {
        document.getElementById('to-bottom')?.classList.add('hidden');
        const el = document.getElementById('prompt-input');
        if (el) {
          el.classList.remove('hidden');
          animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.2 });
        }
      } else {
        if (timerRef.current === null) {
          timerRef.current = setTimeout(() => {
            const el = document.getElementById('to-bottom');
            if (el) {
              el.classList.remove('hidden');
              animate(el, { opacity: [0, 1], y: [30, 0] }, { duration: 0.2 });
            }
          }, 600);
        }
        document.getElementById('prompt-input')?.classList.add('hidden');
      }
    }
  }, [atBottom, receiving]);

  useEffect(() => {
    if (!model && dialogRef.current && !dialogRef.current.isOpen()) {
      // when model is not set, open picker dialog by default
      dialogRef.current.open(conversation.subject);
    }
  }, [model, dialogRef.current]);

  const renderBottomSection = () => {
    if (receiving)
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.2, type: 'tween' },
          }}
        >
          <ChatStop />
        </motion.div>
      );
    return (
      <>
        <div id="to-bottom" className="hidden">
          <ToBottom onClick={onToBottomClick} />
        </div>
        <div id="prompt-input" className="size-full">
          <ChatPromptInput conversationId={conversation.id} />
        </div>
      </>
    );
  };

  const render = () => {
    return (
      <ScrollArea className="w-full grow" viewportRef={viewportRef}>
        <div className="relative mx-auto w-[640px] pb-4">
          {isSuccess && <MemoizedMessageList messages={messagesWithModelId} />}
          <BotMessageReceiver
            onMessageReceived={onNewBotMessage}
            onReceivingChange={onReceivingChange}
            onReady={() => setListenerReady(true)}
          />
          <div className="h-[104px]" />
          <ScrollBottom scrollContainerRef={viewportRef} />
          <div
            className={cn(
              'fixed bottom-0 mt-4 flex min-h-[104px] w-[640px]',
              atBottom ? ' bg-background' : 'bg-transparent'
            )}
          >
            <div className="flex w-full flex-col items-center justify-center">
              {renderBottomSection()}
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  };

  const renderNoModel = () => {
    return (
      <div className="flex size-full flex-col items-center justify-center gap-4">
        <h2 className="text-3xl font-semibold tracking-tight">
          {t('page-conversation:message:no-model')}
        </h2>
        <Button onClick={onChooseClick}>
          <Package className="size-4 text-foreground" />
          <span className="ml-2">{t('generic:action:choose-a-model')}</span>
        </Button>
        <ModelPickerDialog ref={dialogRef} onSubmit={onChooseSubmit} />
      </div>
    );
  };

  return (
    <TwoRows className="max-h-screen">
      <TwoRows.Top>
        <ConversationTitleBar
          title={conversation.subject}
          model={model}
          onEditDone={onTitleChange}
        />
      </TwoRows.Top>
      <TwoRows.Bottom className="flex size-full flex-col items-center overflow-hidden bg-background">
        {model ? render() : renderNoModel()}
      </TwoRows.Bottom>
    </TwoRows>
  );
}
