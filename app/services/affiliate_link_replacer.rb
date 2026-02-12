class AffiliateLinkReplacer
  COUPANG_TAG = "tinyhoney-23" # Example tag

  def self.call(url)
    new(url).call
  end

  def initialize(url)
    @url = url
  end

  def call
    return @url unless @url.include?("coupang.com")
    
    # Simple replacement logic
    if @url.include?("?")
      "#{@url}&lptag=#{COUPANG_TAG}"
    else
      "#{@url}?lptag=#{COUPANG_TAG}"
    end
  end
end
