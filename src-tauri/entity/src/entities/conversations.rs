//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.14

use sea_orm::{entity::prelude::*, FromQueryResult};
use serde::{Deserialize, Serialize};

#[derive(Clone, Default, Debug, PartialEq, DeriveEntityModel, Eq, Deserialize, Serialize)]
#[sea_orm(table_name = "conversations")]
#[serde(rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)]
    pub id: i32,
    pub model_id: i32,
    pub subject: String,
    #[serde(skip_deserializing)]
    pub options: String,
    #[serde(skip_deserializing)]
    pub created_at: DateTimeLocal,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(skip_deserializing)]
    pub updated_at: Option<DateTimeLocal>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(skip_deserializing)]
    pub deleted_at: Option<DateTimeLocal>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::messages::Entity")]
    Messages,
    #[sea_orm(
        belongs_to = "super::models::Entity",
        from = "Column::ModelId",
        to = "super::models::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Models,
}

impl Related<super::messages::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Messages.def()
    }
}

impl Related<super::models::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Models.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Clone, Debug, FromQueryResult, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ConversationListItem {
    pub id: i32,
    pub model_id: i32,
    pub subject: String,
    pub options: String,
    pub created_at: DateTimeLocal,
    pub updated_at: Option<DateTimeLocal>,
    pub deleted_at: Option<DateTimeLocal>,
    pub message_count: Option<i32>,
    pub model_provider: Option<String>,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewConversation {
    pub model_id: i32,
    pub message: String,
}