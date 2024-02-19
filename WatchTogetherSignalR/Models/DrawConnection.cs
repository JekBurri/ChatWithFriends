using Microsoft.OpenApi.Any;

namespace WatchTogetherSignalR.Models
{
    public class DrawConnection
    {
        public int DrawingId { get; set; }
        public Dictionary<string, object> DrawingData { get; set; }
    }
}
