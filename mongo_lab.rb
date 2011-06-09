class MongoLab
	include HTTParty
	base_uri 'https://mongolab.com/api/1/databases/tba/collections'
	
	def api_key_hash
	  { :apiKey => '4dd166305e4c8769e3e8e09a'}
  end
	
	def call env
	  
	  request = Rack::Request.new(env)
	  
	  method = request.request_method.downcase
	  path = request.path_info
	  
	  options = {}
	  options[:body] = request.params.to_json
	  options[:query] = api_key_hash

	  response = self.class.send(method, path, { :body => request.params.to_json, :query => api_key_hash, :headers => { 'Content-Type' => 'text/plain' } })
	  [response.code, response.headers, [response.body]]
	end
end