class TBA::Trips < TBA::Base

  get '/' do
    @trips = Trip.find
    haml :trips
  end
  
  post '/' do
    must_be_logged_in

    trip = Trip.new params[:trip]

    if trip.save
      flash[:notice] = 'Trip created'
      redirect "/trips/#{trip['_id']}"
    else
      flash[:errors] = trip.errors.to_s
      redirect "/"
    end
    
  end

  get '/:trip_id' do
    must_be_logged_in
    
    @trip = Trip.find_by_id params[:trip_id]
    haml :trip
  end
  
  get '/:trip_id/edit' do
    must_be_logged_in
    
    @trip = Trip.find_by_id params[:trip_id]
    haml :create
  end

end