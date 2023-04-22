package auth

const (
	ROLE_CITIZEN       = "citizen"
	ROLE_ADMINISTRATOR = "administrator"
)

type User struct {
	Role string `json:"role"`
	Id   int    `json:"id"`
}
