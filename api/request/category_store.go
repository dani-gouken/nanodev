package request

import (
	"context"
)

// Store defines a backend storage interface contract
type CategoryStore interface {
	FindAll(ctx context.Context) ([]Category, error)
	Save(ctx context.Context, category *Category) error
}
