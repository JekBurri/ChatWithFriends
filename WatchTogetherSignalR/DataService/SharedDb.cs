using System.Collections.Concurrent;
using WatchTogetherSignalR.Models;

namespace WatchTogetherSignalR.Models
{
    public class SharedDb
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connections = new ConcurrentDictionary<string, UserConnection>();

        public ConcurrentDictionary<string, UserConnection> connections => _connections;


        private readonly ConcurrentDictionary<string, DrawConnection> _drawings = new ConcurrentDictionary<string, DrawConnection>();

        public ConcurrentDictionary<string, DrawConnection> drawings => _drawings;
    }
}
