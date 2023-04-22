package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"nano.dev/gov_request/request"
)

func MakeGetCategory(store request.CategoryStore) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		categories, err := store.FindAll(ctx.Request.Context())
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"status": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, categories)
	}
}
