import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Crown, Star, MapPin, Edit, Save, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

// Component pour éditer un profil
function EditProfileModal({ profile, onUpdate }: { profile: User; onUpdate: () => void }) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    age: profile.age,
    city: profile.city,
    bio: profile.bio || "",
    photo: profile.photo || "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const response = await fetch(`/api/admin/profile/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Profil mis à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/test-profiles"] });
      setIsOpen(false);
      onUpdate();
    },
    onError: () => {
      toast({ title: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  // Suggestions de photos par ID pour seniors
  const generatePhotoSuggestions = (gender: 'men' | 'women') => {
    const ids = Array.from({ length: 30 }, (_, i) => i + 40); // IDs 40-70 pour seniors
    return ids.map(id => `https://randomuser.me/api/portraits/${gender}/${id}.jpg`);
  };

  const menPhotos = generatePhotoSuggestions('men');
  const womenPhotos = generatePhotoSuggestions('women');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Edit className="h-4 w-4 mr-1" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le profil de {profile.firstName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Âge</label>
              <Input
                type="number"
                min="50"
                max="75"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photo actuelle</label>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={formData.photo || "https://via.placeholder.com/80x80"}
                alt="Photo actuelle"
                className="w-16 h-16 rounded-full object-cover"
              />
              <Input
                value={formData.photo}
                onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.value }))}
                placeholder="URL de la photo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Suggestions de photos (Hommes seniors)</label>
            <div className="grid grid-cols-8 gap-2 mb-4">
              {menPhotos.slice(0, 16).map((photoUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo: photoUrl }))}
                  className={`border-2 rounded-full overflow-hidden hover:border-primary ${
                    formData.photo === photoUrl ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Homme ${index + 40}`}
                    className="w-10 h-10 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Suggestions de photos (Femmes seniors)</label>
            <div className="grid grid-cols-8 gap-2 mb-4">
              {womenPhotos.slice(0, 16).map((photoUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, photo: photoUrl }))}
                  className={`border-2 rounded-full overflow-hidden hover:border-primary ${
                    formData.photo === photoUrl ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Femme ${index + 40}`}
                    className="w-10 h-10 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 mr-1" />
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-1" />
              {updateMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Profiles() {
  // Get suggested profiles based on user preferences
  const { data: profilesData, isLoading, refetch } = useQuery<{ profiles: User[] }>({
    queryKey: ["/api/profiles/suggested"],
  });

  const profiles = profilesData?.profiles || [];

  const getSubscriptionBadge = (subscription: string) => {
    if (subscription === 'gold') {
      return (
        <Badge className="bg-yellow-500 text-white text-xs">
          <Crown className="h-3 w-3 mr-1" />
          Gold
        </Badge>
      );
    }
    if (subscription === 'premium') {
      return (
        <Badge className="bg-purple-600 text-white text-xs">
          <Star className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        Gratuit
      </Badge>
    );
  };

  const getGlowClass = (subscription: string) => {
    if (subscription === 'gold') return 'gold-glow';
    if (subscription === 'premium') return 'premium-glow';
    return '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement des profils...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-4 md:p-6 flex items-center">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="mr-4 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-lg md:text-xl font-semibold">
          Profils de test ({profiles.length})
        </h2>
      </div>

      {/* Profiles Grid */}
      <div className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {profiles.map((user: User) => (
            <Card key={user.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${getGlowClass(user.subscription)}`}>
              <div className="relative">
                <img
                  src={user.photo || "https://via.placeholder.com/300x400"}
                  alt={`Profil de ${user.firstName}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getSubscriptionBadge(user.subscription)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <h3 className="text-white font-semibold text-sm md:text-base">
                    {user.firstName}, {user.age} ans {(user as any).gender && `(${(user as any).gender})`}
                  </h3>
                  <p className="text-white/90 text-xs md:text-sm flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.city}
                  </p>
                </div>
              </div>
              
              <CardContent className="p-3 md:p-4">
                <p className="text-gray-700 text-xs md:text-sm mb-3 line-clamp-3">
                  {user.bio}
                </p>
                
                <div className="flex flex-wrap gap-1 md:gap-2 mb-3">
                  {user.interests?.slice(0, 3).map((interest, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-pink-100 text-primary text-xs px-2 py-1"
                    >
                      {interest}
                    </Badge>
                  ))}
                  {user.interests && user.interests.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      +{user.interests.length - 3}
                    </Badge>
                  )}
                </div>
                
                <EditProfileModal profile={user} onUpdate={refetch} />
              </CardContent>
            </Card>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Aucun profil de test trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Générez des profils de test depuis le panel d'administration
            </p>
            <Link href="/admin">
              <Button>
                Retour à l'administration
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}