require "test_helper"

class DealMailerTest < ActionMailer::TestCase
  test "hot_deal_alert" do
    mail = DealMailer.hot_deal_alert
    assert_equal "Hot deal alert", mail.subject
    assert_equal [ "to@example.org" ], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match "Hi", mail.body.encoded
  end
end
