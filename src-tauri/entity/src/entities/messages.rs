//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.14

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

pub enum Roles {
    User,
    Bot,
    System,
}

impl Into<i32> for Roles {
    fn into(self) -> i32 {
        match self {
            Roles::User => 0,
            Roles::Bot => 1,
            Roles::System => 2,
        }
    }
}

impl From<i32> for Roles {
    fn from(value: i32) -> Self {
        match value {
            0 => Roles::User,
            1 => Roles::Bot,
            2 => Roles::System,
            _ => panic!("Invalid role"),
        }
    }
}

#[derive(Clone, Default, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "messages")]
#[serde(rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub conversation_id: i32,
    pub role: i32,
    pub content: String,
    pub created_at: DateTimeLocal,
    pub deleted_at: Option<DateTimeLocal>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::conversations::Entity",
        from = "Column::ConversationId",
        to = "super::conversations::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Conversations,
}

impl Related<super::conversations::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Conversations.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(DeriveIntoActiveModel, Deserialize)]
pub struct NewMessage {
    pub conversation_id: i32,
    pub role: i32,
    pub content: String,
}