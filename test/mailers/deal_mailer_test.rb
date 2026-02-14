require "test_helper"

class DealMailerTest < ActionMailer::TestCase
  test "hot_deal_alert" do
    user = users(:one)
    deal = deals(:one)

    mail = DealMailer.hot_deal_alert(user, deal)

    assert_equal "[티꿀모아] 키워드 매칭 핫딜 알림: #{deal.title}", mail.subject
    assert_equal [user.email], mail.to
    assert_equal [ "from@example.com" ], mail.from
    assert_match deal.title, mail.body.encoded
  end
end
