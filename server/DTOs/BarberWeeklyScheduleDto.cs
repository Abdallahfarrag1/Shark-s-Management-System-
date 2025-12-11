using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.DTOs
{
    [JsonConverter(typeof(WeeklyScheduleDtoJsonConverter))]
    public class WeeklyScheduleDto
    {
        public Dictionary<string, DailyScheduleDto> Days { get; set; } = new Dictionary<string, DailyScheduleDto>();
    }

    public class BarberWeeklyScheduleDto
    {
        public int BarberId { get; set; }
        public List<DailyScheduleDto> WeeklySchedule { get; set; } = new();
    }

    internal class WeeklyScheduleDtoJsonConverter : JsonConverter<WeeklyScheduleDto>
    {
        public override WeeklyScheduleDto? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using var doc = JsonDocument.ParseValue(ref reader);
            var root = doc.RootElement;

            var result = new WeeklyScheduleDto();

            if (root.ValueKind == JsonValueKind.Object)
            {
                // If JSON uses new shape { "Days": { ... } }
                if (root.TryGetProperty("Days", out var daysProp) && daysProp.ValueKind == JsonValueKind.Object)
                {
                    var dict = JsonSerializer.Deserialize<Dictionary<string, DailyScheduleDto>>(daysProp.GetRawText(), options);
                    if (dict != null)
                        result.Days = dict;
                }
                else
                {
                    // Otherwise assume object itself is Dictionary<string, DailyScheduleDto>
                    var dict = JsonSerializer.Deserialize<Dictionary<string, DailyScheduleDto>>(root.GetRawText(), options);
                    if (dict != null)
                        result.Days = dict;
                }
            }

            return result;
        }

        public override void Write(Utf8JsonWriter writer, WeeklyScheduleDto value, JsonSerializerOptions options)
        {
            // Serialize using the newer shape with Days property
            writer.WriteStartObject();
            writer.WritePropertyName("Days");
            JsonSerializer.Serialize(writer, value.Days, options);
            writer.WriteEndObject();
        }
    }
}
