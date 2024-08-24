export class RouteDTO{
  id_route: number;
  km_available_star: number;
  km_available_end: number;
  pick_up_location: string;
  end_time: string;

  constructor(
    id_route: number,
    km_available_star: number,
    km_available_end: number,
    pick_up_location: string,
    end_time: string,
  ){
      this.id_route = id_route;
      this.km_available_star= km_available_star;
      this.km_available_end= km_available_end;
      this.pick_up_location= pick_up_location;
      this.end_time= end_time;

  }
}
