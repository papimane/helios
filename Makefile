.PHONY: help install dev build start stop restart logs clean docker-build docker-up docker-down docker-restart docker-logs docker-shell docker-clean

# Variables
COMPOSE_FILE = docker-compose.yml
APP_NAME = helios-security

# Couleurs
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m

help: ## Afficher l'aide
	@echo "$(GREEN)Commandes Helios Security:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# Commandes locales
install: ## Installer les dépendances
	@echo "$(GREEN)Installation des dépendances...$(NC)"
	npm install

dev: ## Démarrer en mode développement
	@echo "$(GREEN)Démarrage en mode développement...$(NC)"
	npm run dev

build: ## Builder l'application
	@echo "$(GREEN)Build de l'application...$(NC)"
	npm run build

start: ## Démarrer en production
	@echo "$(GREEN)Démarrage en production...$(NC)"
	npm run start

# Commandes Docker
docker-build: ## Builder l'image Docker
	@echo "$(GREEN)Build de l'image Docker...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build

docker-up: ## Démarrer les conteneurs
	@echo "$(GREEN)Démarrage des conteneurs...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✓ Application sur http://localhost:3000$(NC)"

docker-down: ## Arrêter les conteneurs
	@echo "$(YELLOW)Arrêt des conteneurs...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down

docker-restart: docker-down docker-up ## Redémarrer les conteneurs

docker-logs: ## Afficher les logs
	docker-compose -f $(COMPOSE_FILE) logs -f

docker-shell: ## Ouvrir un shell dans le conteneur
	docker-compose -f $(COMPOSE_FILE) exec $(APP_NAME) sh

docker-clean: docker-down ## Nettoyer Docker
	@echo "$(YELLOW)Nettoyage Docker...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all

# Aliases
stop: docker-down ## Arrêter (alias)

restart: docker-restart ## Redémarrer (alias)

logs: docker-logs ## Logs (alias)

clean: ## Nettoyer les builds
	@echo "$(YELLOW)Nettoyage...$(NC)"
	rm -rf .next node_modules out
