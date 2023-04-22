package server

import (
	"github.com/gin-gonic/gin"
	"nano.dev/gov_request/auth"
	"nano.dev/gov_request/request"
)

func AddRequestRoutes(r *gin.RouterGroup, store request.RequestStore) {
	group := r.Group("")
	group.Use(NewRoleAccessMiddleware(auth.ROLE_CITIZEN))
	group.POST("/request", MakePostRequestHandler(store))
	group.GET("/request", MakeGetRequestHandler(store))
}

func AddCategoryRoutes(r *gin.RouterGroup, store request.CategoryStore) {
	r.POST("/category", MakePostCategory(store))
	r.GET("/category", MakeGetCategory(store))
}
