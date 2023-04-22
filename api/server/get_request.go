package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"nano.dev/gov_request/request"
)

func MakeGetRequestHandler(store request.RequestStore) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user := GetUser(ctx)

		requests, err := store.FindByUser(ctx.Request.Context(), user)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, requests)
	}
}
