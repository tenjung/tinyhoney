class AddShopAndShippingToDeals < ActiveRecord::Migration[8.0]
  def change
    add_column :deals, :shop_name, :string
    add_column :deals, :shipping_fee, :integer, default: 0
  end
end
