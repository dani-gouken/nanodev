package server

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"nano.dev/gov_request/auth"
)

func NewAuthMiddleware(parser auth.TokenParser) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString := ExtractToken(ctx)
		if tokenString == "" {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": "Token is missing",
			})
			return
		}
		user, err := parser.Parse(tokenString)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"message": err.Error(),
			})
			return
		}
		ctx.Set("user", user)
		ctx.Next()
	}
}
func NewRoleAccessMiddleware(role string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user := GetUser(ctx)
		if user.Role != auth.ROLE_CITIZEN {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"message": "You are not allowed to access the request ressource",
			})
			return
		}
		ctx.Next()
	}
}

func GetUser(ctx *gin.Context) auth.User {
	return ctx.MustGet("user").(auth.User)

}
func ExtractToken(c *gin.Context) string {
	bearerToken := c.Request.Header.Get("Authorization")
	if len(strings.Split(bearerToken, " ")) == 2 {
		return strings.Split(bearerToken, " ")[1]
	}
	return ""
}
