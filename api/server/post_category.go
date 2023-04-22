package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"nano.dev/gov_request/request"
)

func MakePostCategory(store request.CategoryStore) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		category := request.Category{}
		if err := ctx.ShouldBindJSON(&category); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		err := store.Save(ctx.Request.Context(), &category)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"status": err.Error()})
			return
		}
		ctx.JSON(http.StatusOK, category)
	}
}
