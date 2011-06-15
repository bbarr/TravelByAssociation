class TBA::JSONProxy
	include HTTParty
	base_uri 'https://mongolab.com/api/1/databases/tba/collections'
	
	def api_key_hash
	  return @api_key_hash unless @api_key_hash.nil?
	  api_key = TBA::Database['api_keys'].find_one({ :service => 'mongolab' })['key']
	  @api_key_hash = { :apiKey => api_key }
  end
  
	def call env
	  
	  request = Rack::Request.new(env)
	  
	  method = request.request_method.downcase
	  path = request.path_info
	  body = request.params.to_json

	  response = self.class.send(method, path, { 
	    :body => body,
	    :query => api_key_hash,
	    :headers => { 'Content-Type' => 'text/plain' } 
	  })

	  [response.code, response.headers, [response.body]]
	end
end