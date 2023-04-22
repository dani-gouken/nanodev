package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"nano.dev/gov_request/request"
)

func MakePostRequestHandler(store request.RequestStore) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		user := GetUser(ctx)
		dto := request.CreateRequestDto{}

		if err := ctx.ShouldBindJSON(&dto); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		create, err := store.Create(ctx.Request.Context(), user, dto)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, create)
	}
}
