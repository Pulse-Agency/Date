import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Heart, Bell, Crown } from "lucide-react";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProfileCard from "@/components/profile-card";
import FlashCounter from "@/components/flash-counter";
import BottomNavigation from "@/components/bottom-navigation";
import MatchNotification from "@/components/match-notification";
import SocialProofNotification from "@/components/social-proof-notification";
import NotificationDemo from "@/components/notification-demo";
import { MatchAnimation, FlashSuccessAnimation } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { useSocialProof } from "@/hooks/use-social-proof";
import type { User } from "@shared/schema";

// Fonction pour générer des messages de bienvenue personnalisés
function getWelcomeMessage(firstName: string): string {
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  
  const messages = [
    `${timeGreeting} ${firstName} ! Prêt pour de nouvelles rencontres ?`,
    `Ravi de vous revoir ${firstName} ! De nouveaux profils vous attendent.`,
    `${timeGreeting} ${firstName} ! Qui sait qui vous allez rencontrer aujourd'hui ?`,
    `Bienvenue ${firstName} ! Votre âme sœur est peut-être à portée de clic.`,
    `${timeGreeting} ${firstName} ! L'amour n'attend pas, explorez de nouveaux profils.`
  ];
  
  // Utilise le jour de l'année pour avoir un message différent chaque jour
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return messages[dayOfYear % messages.length];
}

export default function Home() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [showFlashAnimation, setShowFlashAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { isVisible: showSocialProof, hideNotification: hideSocialProof } = useSocialProof();

  // Get current user
  const { data: currentUserData, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["/api/users/current"],
    retry: 3,
    retryDelay: 1000,
  });

  const currentUser = (currentUserData as any)?.user;

  // Get user suggestions
  const { data: suggestionsData, refetch: refetchSuggestions } = useQuery({
    queryKey: ["/api/users/suggestions", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const suggestions = (suggestionsData as any)?.suggestions || [];

  // Get flash count
  const { data: flashData } = useQuery({
    queryKey: ["/api/flashes/remaining", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  // Get matches for unread message count
  const { data: matchesData } = useQuery({
    queryKey: ["/api/matches", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const unreadMessages = (matchesData as any)?.matches?.reduce((total: number, match: any) => 
    total + match.unreadCount, 0) || 0;

  // Flash mutation
  const flashMutation = useMutation({
    mutationFn: async (toUserId: number) => {
      const response = await apiRequest("POST", "/api/flashes", {
        fromUserId: currentUser!.id,
        toUserId
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Animation de flash réussi
      setShowFlashAnimation(true);
      
      if (data.isMatch) {
        const matchedProfile = suggestions[currentCardIndex];
        setMatchedUser(matchedProfile);
        
        // Délai pour laisser l'animation de flash, puis match
        setTimeout(() => {
          setShowMatchAnimation(true);
          setShowMatchNotification(true);
        }, 800);
        
        toast({
          title: "C'est un match ! 💕",
          description: `Vous et ${matchedProfile.firstName} vous êtes flashés mutuellement !`,
        });
      } else {
        toast({
          title: "Flash envoyé !",
          description: "Votre intérêt a été transmis discrètement.",
        });
      }
      
      setTimeout(() => {
        handleNextCard();
      }, 1000);
      
      queryClient.invalidateQueries({ queryKey: ["/api/flashes/remaining"] });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFlash = () => {
    if (currentCard && canFlash) {
      flashMutation.mutate(currentCard.id);
    }
  };

  const handlePass = () => {
    handleNextCard();
  };

  const handleNextCard = () => {
    setCurrentCardIndex(prev => prev + 1);
  };

  const currentCard = suggestions[currentCardIndex];
  const canFlash = (flashData as any) && ((flashData as any).remaining === 'unlimited' || (flashData as any).remaining > 0);

  // Gestion améliorée du chargement et erreurs
  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (userError || !currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-6">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Connexion nécessaire
          </h3>
          <p className="text-gray-500 mb-6">
            Veuillez vous connecter pour accéder à l'application
          </p>
          <Link href="/login">
            <Button className="bg-primary hover:bg-primary/90">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header avec message de bienvenue */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-primary mr-3" />
            <div>
              <h1 className="text-xl font-bold">Date Mature</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              {unreadMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </div>
            <Link href="/subscription">
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Crown className="h-4 w-4 mr-1" />
                {currentUser.subscription === 'gold' ? 'Gold' : 
                 currentUser.subscription === 'premium' ? 'Premium' : 'Gratuit'}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Message de bienvenue personnalisé */}
        <div className="mt-3">
          <p className="text-lg text-gray-700">
            {getWelcomeMessage(currentUser.firstName)}
          </p>
        </div>
      </div>

      {/* Flash Counter */}
      {flashData && (
        <FlashCounter
          remaining={(flashData as any).remaining}
          limit={(flashData as any).limit}
          used={(flashData as any).used}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {currentCard ? (
          <div className="absolute inset-0 p-4">
            {/* Render up to 3 cards for stack effect */}
            {suggestions.slice(currentCardIndex, currentCardIndex + 3).map((user: any, index: number) => (
              <ProfileCard
                key={user.id}
                user={user}
                onFlash={index === 0 ? handleFlash : () => {}}
                onPass={index === 0 ? handlePass : () => {}}
                canFlash={index === 0 && canFlash}
                style={{
                  zIndex: 3 - index,
                  transform: `translate(${index * 2}px, ${index * 4}px) scale(${1 - index * 0.02})`,
                  opacity: 1 - index * 0.1,
                }}
                className={index > 0 ? "pointer-events-none" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Plus de profils pour aujourd'hui
              </h3>
              <p className="text-gray-500 mb-6">
                Revenez demain pour découvrir de nouveaux profils ou passez Premium pour plus de flashs !
              </p>
              <Link href="/subscription">
                <Button className="bg-primary hover:bg-primary/90">
                  <Crown className="h-4 w-4 mr-2" />
                  Voir les offres Premium
                </Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* Démonstration des notifications pour tester les animations */}
        {!currentCard && (
          <div className="p-4">
            <NotificationDemo />
          </div>
        )}
      </div>

      {/* Match Notification */}
      {showMatchNotification && matchedUser && (
        <MatchNotification
          matchedUser={matchedUser}
          onContinue={() => setShowMatchNotification(false)}
          onSendMessage={() => {
            setShowMatchNotification(false);
            // Navigate to messages
          }}
        />
      )}

      {/* Social Proof Notification */}
      <SocialProofNotification
        isVisible={showSocialProof}
        onClose={hideSocialProof}
      />

      {/* Animations */}
      <FlashSuccessAnimation
        isVisible={showFlashAnimation}
        onComplete={() => setShowFlashAnimation(false)}
      />
      
      <MatchAnimation
        isVisible={showMatchAnimation}
        onComplete={() => setShowMatchAnimation(false)}
      />

      <BottomNavigation unreadMessages={unreadMessages} />
    </div>
  );
}