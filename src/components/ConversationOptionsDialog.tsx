import { useQueryClient } from '@tanstack/react-query';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

import {
  PROVIDER_AZURE,
  PROVIDER_CLAUDE,
  PROVIDER_OLLAMA,
} from '@/lib/constants';
import { AppError, ERROR_TYPE_APP_STATE } from '@/lib/error';
import { useGetOptionsQuery, useUpdateOptionsMutation } from '@/lib/hooks';
import { useAppStateStore } from '@/lib/store';
import type {
  AzureOptions,
  ClaudeOptions,
  ConversationDetails,
  DialogHandler,
  OllamaOptions,
  OpenAIOptions,
  Options,
} from '@/lib/types';

import OptionsForm from './forms/OptionsForm';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

type Props = {
  conversation: ConversationDetails;
};

export const ConversationOptionsDialog = forwardRef<DialogHandler<void>, Props>(
  ({ conversation }, ref) => {
    const [showDialog, setShowDialog] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const updateOptionsMutation = useUpdateOptionsMutation();
    const {
      key: queryKey,
      query: { data: options, isSuccess, isError, error },
    } = useGetOptionsQuery(conversation.id);
    const queryClient = useQueryClient();
    const model = useAppStateStore((state) =>
      state.models.find((m) => m.id === conversation.modelId)
    );

    useImperativeHandle(ref, () => ({
      open: () => {
        setShowDialog(true);
      },
      close: () => {
        setShowDialog(false);
      },
    }));

    if (!model) {
      // model is not setted or is deleted
      return null;
    }

    if (isError && error) {
      throw new AppError(
        ERROR_TYPE_APP_STATE,
        error.message,
        'Failed to load conversation options!'
      );
    }

    // Callbacks
    const onFormSubmit = (formData: Options) => {
      updateOptionsMutation.mutate(
        {
          conversationId: conversation.id,
          options: formData,
        },
        {
          onSuccess: async () => {
            toast.success('Options are successfully saved');
            return queryClient.invalidateQueries({ queryKey });
          },
          onError: (e) => {
            toast.error(e.message);
          },
          onSettled: () => {
            setShowDialog(false);
            formRef.current?.reset();
          },
        }
      );
    };

    const renderForm = () => {
      switch (model.provider) {
        case PROVIDER_AZURE:
          return (
            <OptionsForm.Azure
              id="optionsForm"
              ref={formRef}
              onSubmit={onFormSubmit}
              defaultValues={options as AzureOptions}
            />
          );
        case PROVIDER_CLAUDE:
          return (
            <OptionsForm.Claude
              id="optionsForm"
              ref={formRef}
              onSubmit={onFormSubmit}
              defaultValues={options as ClaudeOptions}
            />
          );
        case PROVIDER_OLLAMA:
          return (
            <OptionsForm.Ollama
              id="optionsForm"
              ref={formRef}
              onSubmit={onFormSubmit}
              defaultValues={options as OllamaOptions}
            />
          );
        default:
          // handle both OpenAI and CUSTOM models here
          return (
            <OptionsForm.OpenAI
              id="optionsForm"
              ref={formRef}
              onSubmit={onFormSubmit}
              defaultValues={options as OpenAIOptions}
            />
          );
      }
    };

    return isSuccess && options ? (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        {/* <DialogTrigger asChild>
          <Button variant="outline" className={className}>
            <Settings2 className="size-4" />
          </Button>
        </DialogTrigger> */}
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Change options of this conversation</DialogTitle>
            <DialogDescription>
              Altering the options can cause unpredictable behaviors and even
              errors. Make sure you know what you are changing.
            </DialogDescription>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button form="optionsForm">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ) : null;
  }
);
