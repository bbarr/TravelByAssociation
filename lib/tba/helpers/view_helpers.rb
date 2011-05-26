module ViewHelpers

  # Render content that was stored in the content array with the given key
  def content(key)
    @content && @content[key]
  end

  # Define content for a particular key to render later at the appropriate
  # point, Simulates Rails's content_for helper
  def content_for(key, &block)
    @content ||= {}
    @content[key] = capture_haml(&block)
  end
  
end