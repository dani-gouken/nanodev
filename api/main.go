package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"nano.dev/gov_request/auth"
	"nano.dev/gov_request/request"
	"nano.dev/gov_request/server"
)

func main() {
	app, db := Bootstrap()
	jwtPassphare := os.Getenv("JWT_SECRET")

	app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	requestStore := request.NewRequestDatabaseStore(db)
	categoryStore := request.NewCategoryDatabaseStore(db)

	tokenParser := auth.NewJWTParser(jwtPassphare)

	api := app.Group("/api")
	api.Use(server.NewAuthMiddleware(tokenParser))
	server.AddRequestRoutes(api, requestStore)
	server.AddCategoryRoutes(api, categoryStore)

	app.Run()
}

func Bootstrap() (*gin.Engine, *gorm.DB) {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dsn := "nanodev:nanodev@tcp(localhost:3301)/nanocity?charset=utf8&parseTime=true"
	logger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second, // Slow SQL threshold
			LogLevel:                  logger.Info, // Log level
			IgnoreRecordNotFoundError: true,        // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,        // Don't include params in the SQL log
			Colorful:                  false,       // Disable color
		},
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger,
		NowFunc: func() time.Time {
			return time.Now().Local()
		},
	})
	if err != nil {
		panic("failed to connect database")
	}
	return gin.Default(), db
}
