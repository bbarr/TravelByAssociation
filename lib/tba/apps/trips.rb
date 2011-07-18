class TBA::Trips < TBA::Base

  get '/' do
    @trips = Trip.fields(:_id, :title, :user_id).all
    haml :"trips/index"
  end
  
  post '/' do
    must_be_admin

    trip = Trip.new params[:trip]

    if trip.save
      redirect "/trips/#{trip[:_id]}"
    else
      content_type :json
      status 400
      trip.errors.to_json
    end
  end

  get '/:trip_id' do
    must_be_someone
    @trip = Trip.find_by_id params[:trip_id]
    haml :"trips/show"
  end
  
  delete '/:trip_id' do
    must_be_admin
    
    trip = Trip.find_by_id params[:trip]
    trip.remove unless trip.nil?
    
    haml :index
  end

end