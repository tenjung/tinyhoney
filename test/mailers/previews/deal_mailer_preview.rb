# Preview all emails at http://localhost:3000/rails/mailers/deal_mailer
class DealMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:3000/rails/mailers/deal_mailer/hot_deal_alert
  def hot_deal_alert
    DealMailer.hot_deal_alert
  end
end
