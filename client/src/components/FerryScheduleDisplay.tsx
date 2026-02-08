import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  MapPin,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Ship,
} from "lucide-react";
import {
  FERRY_SCHEDULES,
  BOAT_FLEET,
  FerrySchedule,
  getFerrySchedulesForRoute,
  getBoatInfo,
} from "@/data/ferrySchedules";

interface FerryScheduleDisplayProps {
  from?: string;
  to?: string;
}

export default function FerryScheduleDisplay({
  from = "Malé City",
  to = "Ari Atoll",
}: FerryScheduleDisplayProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<FerrySchedule | null>(null);
  const [filterDay, setFilterDay] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"time" | "price" | "duration">("time");

  const schedules = getFerrySchedulesForRoute(from, to);

  const filteredSchedules = schedules
    .filter((schedule) => {
      if (filterDay === "all") return true;
      return schedule.daysOfOperation.includes(filterDay);
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return a.departureTime.localeCompare(b.departureTime);
      } else if (sortBy === "price") {
        return a.price - b.price;
      } else {
        // duration
        const aDuration = parseInt(a.duration.split(" ")[0]);
        const bDuration = parseInt(b.duration.split(" ")[0]);
        return aDuration - bDuration;
      }
    });

  const occupancyPercentage = (schedule: FerrySchedule) => {
    return Math.round((schedule.currentOccupancy / schedule.capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage < 50) return "text-green-600";
    if (percentage < 80) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Route Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-muted-foreground">From</p>
            <p className="font-semibold">{from}</p>
          </div>
          <Ship className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">To</p>
            <p className="font-semibold">{to}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Available Schedules</p>
          <p className="text-2xl font-bold text-accent">{filteredSchedules.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Filter by Day</label>
          <Select value={filterDay} onValueChange={setFilterDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
              <SelectItem value="Sunday">Sunday</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Departure Time</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <Card
              key={schedule.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedSchedule?.id === schedule.id ? "ring-2 ring-accent" : ""
              }`}
              onClick={() => setSelectedSchedule(schedule)}
            >
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Time */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Departure</p>
                    <p className="text-2xl font-bold">{schedule.departureTime}</p>
                    <p className="text-xs text-muted-foreground">
                      Arrives {schedule.arrivalTime}
                    </p>
                  </div>

                  {/* Duration */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duration</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-accent" />
                      <p className="font-semibold">{schedule.duration}</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Occupancy</p>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent" />
                      <div className="flex-1">
                        <div className="bg-secondary rounded-full h-2">
                          <div
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{
                              width: `${occupancyPercentage(schedule)}%`,
                            }}
                          />
                        </div>
                        <p className={`text-xs font-semibold mt-1 ${getOccupancyColor(occupancyPercentage(schedule))}`}>
                          {occupancyPercentage(schedule)}% full
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-accent" />
                      <p className="text-xl font-bold">{schedule.price}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-end">
                    {schedule.status === "on-time" ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">On Time</span>
                      </div>
                    ) : schedule.status === "delayed" ? (
                      <div className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Delayed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">Cancelled</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No schedules available for selected filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Schedule Details */}
      {selectedSchedule && (
        <Card className="border-accent/50 bg-accent/5">
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Boat Type</p>
                <p className="font-semibold capitalize">{selectedSchedule.boatType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                <p className="font-semibold">{selectedSchedule.capacity} passengers</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Available Seats</p>
                <p className="font-semibold text-green-600">
                  {selectedSchedule.capacity - selectedSchedule.currentOccupancy} seats
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Frequency</p>
                <p className="font-semibold">{selectedSchedule.frequency}</p>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <p className="text-sm font-semibold mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {selectedSchedule.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-secondary text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Days of Operation */}
            <div>
              <p className="text-sm font-semibold mb-2">Days of Operation</p>
              <div className="flex flex-wrap gap-2">
                {selectedSchedule.daysOfOperation.map((day, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {selectedSchedule.notes && (
              <div className="p-3 bg-background rounded border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Note:</span> {selectedSchedule.notes}
                </p>
              </div>
            )}

            {/* Book Button */}
            <Button className="w-full gap-2 bg-accent text-primary hover:bg-accent/90">
              <Ship className="w-4 h-4" />
              Book This Schedule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fleet Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fleet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BOAT_FLEET.slice(0, 3).map((boat) => (
              <div key={boat.id} className="p-3 bg-secondary/50 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{boat.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{boat.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-accent">{boat.rating}/5</p>
                    <p className="text-xs text-muted-foreground">{boat.reviews} reviews</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Capacity</p>
                    <p className="font-semibold">{boat.capacity} pax</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Speed</p>
                    <p className="font-semibold">{boat.speed}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Operator</p>
                    <p className="font-semibold">{boat.operator}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
