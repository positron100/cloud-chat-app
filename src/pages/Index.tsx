import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [isJoining, setIsJoining] = React.useState(false);
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();

  const createNewRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New Room Created", { duration: 3000 });
  };

  const joinRoom = async () => {
    if (!roomId || !username) {
      toast.error("Room ID and username required", { duration: 3000 });
      return;
    }
    
    setIsJoining(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      navigate(`/editor/${roomId}`, {
        state: {
          username,
        },
      });
    } catch (error) {
      setIsJoining(false);
    }
  };

  const handleInputEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      joinRoom();
    }
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden px-6 sm:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-md z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Compile Palace</h1>
          <p className="text-gray-600 mt-2">Code together in real-time</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">Room ID</label>
            <Input
              type="text"
              id="roomId"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={handleInputEnter}
            />
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <Input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyUp={handleInputEnter}
            />
          </div>
          
          <Button 
            onClick={joinRoom}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors relative"
            disabled={isJoining}
          >
            {isJoining ? (
              <span className="flex items-center">
                <Loader className="animate-spin mr-2 h-4 w-4" />
                <span>Joining</span>
              </span>
            ) : (
              "Join Room"
            )}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an invite? 
              <button 
                onClick={createNewRoom} 
                className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                Create a new room
              </button>
            </p>
          </div>

          <div className="border-t pt-4 mt-4">
            <Button
              variant="outline"
              onClick={handleAuthAction}
              className="w-full"
            >
              {user ? 'Sign Out' : 'Sign In / Sign Up'}
            </Button>
            {user && (
              <p className="text-sm text-center mt-2 text-gray-500">
                Signed in as {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-0">
        <ul className="squares">
          {Array.from({ length: 10 }).map((_, idx) => (
            <li
              key={idx}
              style={{
                "--i": Math.random() * 10 + 1,
                "--j": Math.random() * 7 + 1,
              } as React.CSSProperties}
              className="bg-indigo-500/20 absolute list-none rounded-lg animate-float"
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Index;
