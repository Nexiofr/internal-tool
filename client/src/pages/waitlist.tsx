import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Plus,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Edit2,
  MoreVertical,
  Car,
  Fuel,
  Calendar,
  Banknote,
  Palette,
  Gauge,
  Settings2,
  Send,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { WaitlistRequest } from "@shared/schema";

const statusConfig = {
  waiting: { label: "En attente", icon: Clock, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  contacted: { label: "Contacté", icon: Phone, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  converted: { label: "Converti", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  inactive: { label: "Inactif", icon: XCircle, className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

const priorityConfig = {
  low: { label: "Basse", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
  medium: { label: "Moyenne", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  high: { label: "Haute", className: "bg-red-500/10 text-red-600 dark:text-red-400" },
};

const fuelLabels: Record<string, string> = {
  gasoline: "Essence",
  diesel: "Diesel",
  hybrid: "Hybride",
  electric: "Électrique",
};

const transmissionLabels: Record<string, string> = {
  manual: "Manuelle",
  automatic: "Automatique",
};

export default function WaitlistPage() {
  const [selectedRequest, setSelectedRequest] = useState<WaitlistRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [smsContent, setSmsContent] = useState("");
  const { toast } = useToast();

  const { data: requests = [], isLoading } = useQuery<WaitlistRequest[]>({
    queryKey: ["/api/waitlist"],
  });

  const updateWaitlistMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WaitlistRequest> }) => {
      const res = await apiRequest("PATCH", `/api/waitlist/${id}`, data);
      return res.json();
    },
    onSuccess: (updatedRequest) => {
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      if (selectedRequest?.id === updatedRequest.id) {
        setSelectedRequest(updatedRequest);
      }
      toast({ title: "Demande mise à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de mettre à jour la demande.", variant: "destructive" });
    },
  });

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phone.includes(searchQuery) ||
      (request.brandPreference?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (request.modelPreference?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVehicleSummary = (request: WaitlistRequest) => {
    const parts = [];
    if (request.brandPreference) parts.push(request.brandPreference);
    if (request.modelPreference) parts.push(request.modelPreference);
    if (request.yearMin || request.yearMax) {
      if (request.yearMin && request.yearMax) {
        parts.push(`${request.yearMin}-${request.yearMax}`);
      } else if (request.yearMin) {
        parts.push(`≥${request.yearMin}`);
      } else {
        parts.push(`≤${request.yearMax}`);
      }
    }
    return parts.length > 0 ? parts.join(" ") : "Non spécifié";
  };

  return (
    <div className="flex h-full">
      <div className={`flex flex-col border-r ${selectedRequest ? "w-2/5" : "w-full"}`}>
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-semibold">Liste d'attente</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-waitlist">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nouvelle demande</DialogTitle>
                  <DialogDescription>
                    Ajouter un client à la liste d'attente pour un véhicule
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nom du client *</Label>
                    <Input id="clientName" placeholder="Jean Dupont" data-testid="input-client-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input id="phone" placeholder="06 12 34 56 78" data-testid="input-phone" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marque</Label>
                    <Input id="brand" placeholder="Peugeot" data-testid="input-brand" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modèle</Label>
                    <Input id="model" placeholder="3008" data-testid="input-model" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearMin">Année min</Label>
                    <Input id="yearMin" type="number" placeholder="2020" data-testid="input-year-min" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearMax">Année max</Label>
                    <Input id="yearMax" type="number" placeholder="2024" data-testid="input-year-max" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel">Énergie</Label>
                    <Select>
                      <SelectTrigger data-testid="select-fuel">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">Essence</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="hybrid">Hybride</SelectItem>
                        <SelectItem value="electric">Électrique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Boîte</Label>
                    <Select>
                      <SelectTrigger data-testid="select-transmission">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manuelle</SelectItem>
                        <SelectItem value="automatic">Automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxMileage">Kilométrage max</Label>
                    <Input id="maxMileage" type="number" placeholder="50000" data-testid="input-max-mileage" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBudget">Budget max (€)</Label>
                    <Input id="maxBudget" type="number" placeholder="25000" data-testid="input-max-budget" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Notes internes..." data-testid="input-notes" />
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <Switch id="smsConsent" data-testid="switch-sms-consent" />
                    <Label htmlFor="smsConsent">Consentement SMS</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button data-testid="button-submit-waitlist">
                    Ajouter à la liste
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, téléphone, véhicule..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-waitlist"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36" data-testid="select-status-filter">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="waiting">En attente</SelectItem>
                <SelectItem value="contacted">Contacté</SelectItem>
                <SelectItem value="converted">Converti</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Chargement de la liste...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Aucune demande en liste d'attente</p>
              <p className="text-sm text-muted-foreground/75 mt-1">
                Ajoutez des clients recherchant un véhicule
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredRequests.map((request) => {
                const status = statusConfig[request.status as keyof typeof statusConfig];
                const priority = priorityConfig[request.priority as keyof typeof priorityConfig];
                const StatusIcon = status?.icon || Clock;
                const isSelected = selectedRequest?.id === request.id;

                return (
                  <div
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    className={`p-4 cursor-pointer transition-colors hover-elevate ${
                      isSelected ? "bg-accent" : ""
                    }`}
                    data-testid={`waitlist-item-${request.id}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{request.clientName}</span>
                          {request.smsConsent && (
                            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              SMS OK
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {request.phone}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {getVehicleSummary(request)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className={status?.className}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status?.label}
                          </Badge>
                          <Badge variant="outline" className={priority?.className}>
                            {priority?.label}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {request.createdAt
                          ? format(new Date(request.createdAt), "dd MMM", { locale: fr })
                          : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      {selectedRequest && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold">{selectedRequest.clientName}</h2>
              <p className="text-sm text-muted-foreground">{selectedRequest.phone}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Dialog open={isSmsDialogOpen} onOpenChange={setIsSmsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" disabled={!selectedRequest.smsConsent} data-testid="button-send-sms">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Envoyer SMS
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Envoyer un SMS</DialogTitle>
                    <DialogDescription>
                      Envoyer un message à {selectedRequest.clientName}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Votre message..."
                      value={smsContent}
                      onChange={(e) => setSmsContent(e.target.value)}
                      className="min-h-[120px]"
                      data-testid="textarea-sms"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {smsContent.length}/160 caractères
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSmsDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button data-testid="button-confirm-sms">
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="button-waitlist-actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => updateWaitlistMutation.mutate({ id: selectedRequest.id, data: { status: "contacted" } })}
                    data-testid="action-mark-contacted"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Marquer contacté
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => updateWaitlistMutation.mutate({ id: selectedRequest.id, data: { status: "converted" } })}
                    data-testid="action-mark-converted"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Marquer converti
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem data-testid="action-edit">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => updateWaitlistMutation.mutate({ id: selectedRequest.id, data: { status: "inactive" } })}
                    className="text-destructive" 
                    data-testid="action-deactivate"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Désactiver
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Tabs defaultValue="criteria" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 w-fit">
              <TabsTrigger value="criteria" data-testid="tab-criteria">Critères</TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">Historique</TabsTrigger>
              <TabsTrigger value="notes" data-testid="tab-notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="criteria" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Véhicule recherché
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Marque</p>
                          <p className="font-medium">{selectedRequest.brandPreference || "—"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Modèle</p>
                          <p className="font-medium">{selectedRequest.modelPreference || "—"}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Année</p>
                            <p className="font-medium">
                              {selectedRequest.yearMin && selectedRequest.yearMax
                                ? `${selectedRequest.yearMin} - ${selectedRequest.yearMax}`
                                : selectedRequest.yearMin
                                ? `≥ ${selectedRequest.yearMin}`
                                : selectedRequest.yearMax
                                ? `≤ ${selectedRequest.yearMax}`
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Énergie</p>
                            <p className="font-medium">
                              {selectedRequest.fuelPreference
                                ? fuelLabels[selectedRequest.fuelPreference]
                                : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Boîte</p>
                            <p className="font-medium">
                              {selectedRequest.transmissionPreference
                                ? transmissionLabels[selectedRequest.transmissionPreference]
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Km max</p>
                            <p className="font-medium">
                              {selectedRequest.maxMileage
                                ? `${selectedRequest.maxMileage.toLocaleString()} km`
                                : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Budget max</p>
                            <p className="font-medium">
                              {selectedRequest.maxBudget
                                ? `${selectedRequest.maxBudget.toLocaleString()} €`
                                : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Couleur</p>
                            <p className="font-medium">{selectedRequest.colorPreference || "—"}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Informations client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Téléphone</span>
                        <span className="font-medium">{selectedRequest.phone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Consentement SMS</span>
                        <Badge variant={selectedRequest.smsConsent ? "default" : "secondary"}>
                          {selectedRequest.smsConsent ? "Oui" : "Non"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ajouté le</span>
                        <span className="font-medium">
                          {selectedRequest.createdAt
                            ? format(new Date(selectedRequest.createdAt), "d MMMM yyyy", { locale: fr })
                            : "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="flex-1 m-0">
              <div className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Historique des contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedRequest.contactHistory ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{selectedRequest.contactHistory}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Aucun contact enregistré</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 m-0">
              <div className="p-4">
                <Textarea
                  placeholder="Notes internes..."
                  className="min-h-[200px]"
                  defaultValue={selectedRequest.notes || ""}
                  data-testid="textarea-waitlist-notes"
                />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" data-testid="button-save-waitlist-notes">
                    Sauvegarder
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
