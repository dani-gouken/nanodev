package auth

type TokenParser interface {
	Parse(token string) (User, error)
}
