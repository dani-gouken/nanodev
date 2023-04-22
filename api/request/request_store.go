package request

import (
	"context"

	"nano.dev/gov_request/auth"
)

// Store defines a backend storage interface contract
type RequestStore interface {
	Create(ctx context.Context, user auth.User, dto CreateRequestDto) (Request, error)
	FindByUser(ctx context.Context, user auth.User) ([]Request, error)
}

type CreateRequestDto struct {
	CategoryId  int    `json:"categoryId" bindings:"required"`
	Title       string `json:"title" bindings:"required"`
	Description string `json:"description" bindings:"required"`
}
