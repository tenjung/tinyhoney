require "test_helper"

class Admin::DealsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get admin_deals_index_url
    assert_response :success
  end
end
