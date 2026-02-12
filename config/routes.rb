Rails.application.routes.draw do
  # Dashboard First
  root "dashboard#index"

  # Devise & Social Login
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  
  # Core Features
  resources :deals, only: [:index, :show]
  resources :events, only: [:index, :new, :create]
  
  # Community
  resources :boards, only: [:index, :show], path: 'community' do
    resources :posts, only: [:show, :new, :create] do
      resources :comments, only: [:create]
    end
  end

  # User Profile
  resource :profile, only: [:show, :update], controller: 'users'
  
  # Admin Dashboard
  namespace :admin do
    root "dashboard#index"
    resources :deals, only: [:index, :destroy]
    resources :users, only: [:index, :update]
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
