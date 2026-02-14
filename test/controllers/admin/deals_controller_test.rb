require "test_helper"

class Admin::DealsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in users(:one)
  end

  test "should get index" do
    get admin_deals_url
    assert_response :success
  end
end
