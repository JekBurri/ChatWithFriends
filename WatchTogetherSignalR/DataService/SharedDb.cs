using System.Collections.Concurrent;
using WatchTogetherSignalR.Models;

namespace WatchTogetherSignalR.Models
{
    public class SharedDb
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connections = new ConcurrentDictionary<string, UserConnection>();

        public ConcurrentDictionary<string, UserConnection> connections => _connections;
    }
}
