Rails.application.routes.draw do
  # Dashboard First
  root "dashboard#index"

  # Devise & Social Login
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  # Admin Dashboard
  namespace :admin do
    get "/", to: "dashboard#index", as: :dashboard
    resources :deals
    resources :events
    resources :users
    resources :boards
    resources :posts
  end

  # Core Features
  resources :deals, only: [ :index, :show ]
  resources :events, only: [ :index, :show, :new, :create ]

  # Community
  resources :boards, only: [ :index, :show ], path: "community" do
    resources :posts, only: [ :show, :new, :create ] do
      resources :comments, only: [ :create ]
    end
  end

  # User Profile
  resource :profile, only: [ :show, :update ], controller: "users"

  # Admin Dashboard


  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
