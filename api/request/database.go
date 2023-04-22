package request

import (
	"context"

	"gorm.io/gorm"
	"nano.dev/gov_request/auth"
)

type RequestDatabaseStore struct {
	db *gorm.DB
}

func NewRequestDatabaseStore(db *gorm.DB) RequestStore {
	return &RequestDatabaseStore{
		db: db,
	}
}

func (store *RequestDatabaseStore) Create(ctx context.Context, user auth.User, dto CreateRequestDto) (Request, error) {
	request := Request{
		Description: dto.Description,
		Title:       dto.Title,
		Status:      STATUS_DRAFT,
		Category: RequestCategoryLink{
			CategoryId: dto.CategoryId,
		},
		Author: RequestAuthorLink{
			UserId: user.Id,
		},
	}
	err := store.db.Session(&gorm.Session{
		FullSaveAssociations: true,
	}).WithContext(ctx).
		Create(&request).Error
	if err != nil {
		return request, err
	}
	err = store.db.Preload("Category.Category").First(&request, request.ID).Error
	if err != nil {
		return request, err
	}
	return request, nil
}

func (store *RequestDatabaseStore) FindByUser(ctx context.Context, user auth.User) ([]Request, error) {
	results := []Request{}
	err := store.db.
		Preload("Category").
		Preload("Category.Category").
		Where("id IN (?)", store.db.Table("requests_author_links").
			Select("request_id").
			Where("user_id = ?", user.Id),
		).
		Find(&results).Error
	return results, err
}

type CategoryDatabaseStore struct {
	db *gorm.DB
}

func NewCategoryDatabaseStore(db *gorm.DB) CategoryStore {
	return &CategoryDatabaseStore{
		db: db,
	}
}

func (store *CategoryDatabaseStore) FindAll(ctx context.Context) ([]Category, error) {
	result := []Category{}
	err := store.db.WithContext(ctx).Find(&result).Error
	return result, err
}

func (store *CategoryDatabaseStore) Save(ctx context.Context, category *Category) error {
	return store.db.WithContext(ctx).Save(category).Error
}
