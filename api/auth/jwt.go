package auth

import (
	"errors"
	"fmt"

	jwt "github.com/golang-jwt/jwt/v5"
)

type JwtParser struct {
	passphrase string
}

func (parser JwtParser) Parse(tokenString string) (User, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(parser.passphrase), nil
	})
	if err != nil {
		return User{}, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return User{
			Id:   int(claims["id"].(float64)),
			Role: claims["role"].(string),
		}, nil
	}
	return User{}, errors.New("invalid JWT content")
}

func NewJWTParser(passphrase string) TokenParser {
	return &JwtParser{
		passphrase: passphrase,
	}
}
