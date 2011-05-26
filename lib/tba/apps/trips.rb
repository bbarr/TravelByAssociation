class TBA::Trips < TBA::Base

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

  get '/:id' do
    must_be_logged_in
    @trip = Trip.find_by_id params[:id]
    haml :''
  end

end