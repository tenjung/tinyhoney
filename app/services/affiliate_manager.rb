class AffiliateManager
  def self.convert(url)
    return url if url.blank?

    case url
    when /coupang\.com/
      # Add Coupang partner tracking if applicable
      url.include?("?") ? "#{url}&subId=tinyhoney" : "#{url}?subId=tinyhoney"
    when /11st\.co\.kr/
      # Add 11st partner tracking
      url.include?("?") ? "#{url}&utm_source=tinyhoney" : "#{url}?utm_source=tinyhoney"
    when /gmarket\.co\.kr/, /auction\.co\.kr/
      # Add eBay partner tracking
      url.include?("?") ? "#{url}&partnerId=tinyhoney" : "#{url}?partnerId=tinyhoney"
    else
      url
    end
  end
end
