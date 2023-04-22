package request

type Category struct {
	ID   int
	Name string `json:"name" binding:"required,gt=2"`
}
