class DealMailer < ApplicationMailer
  def hot_deal_alert(user, deal)
    @user = user
    @deal = deal
    mail(to: @user.email, subject: "[티꿀모아] 키워드 매칭 핫딜 알림: #{@deal.title}")
  end
end
