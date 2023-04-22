package request

import (
	"time"
)

const (
	STATUS_DRAFT    = "DRAFT"
	STATUS_ACCEPTED = "ACCEPTED"
	STATUS_REFUSED  = "REFUSED"
)

type User struct {
	ID       int
	Requests []Request `gorm:"many2many:requests_users_permissions_user_links"`
}

type Request struct {
	ID          int
	Description string              `json:"description"`
	Title       string              `json:"title"`
	Status      string              `json:"status"`
	Author      RequestAuthorLink   `json:"-"`
	Category    RequestCategoryLink `json:"categoryLink,omitempty"`
	CreatedAt   time.Time           `gorm:"autoUpdateTime"`
	UpdatedAt   time.Time           `gorm:"autoCreateTime"`
}

type RequestAuthorLink struct {
	ID        int `json:"-"`
	RequestId int `json:"-"`
	UserId    int `json:"userId"`
}

type RequestCategoryLink struct {
	ID         int      `json:"-"`
	RequestId  int      `json:"-"`
	Category   Category `json:"category,omitempty"`
	CategoryId int      `json:"-"`
}

func (RequestAuthorLink) TableName() string {
	return "requests_author_links"
}

func (RequestCategoryLink) TableName() string {
	return "requests_category_links"
}

func (User) TableName() string {
	return "up_users"
}
