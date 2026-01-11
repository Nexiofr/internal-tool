import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Database,
  Building2,
  Car,
  Search,
  Plus,
  Edit2,
  Save,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle2,
  Archive,
  MoreVertical,
  Fuel,
  Settings2,
  Euro,
  Gauge,
  Palette,
  Image,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Vehicle, KnowledgeItem } from "@shared/schema";

const statusConfig = {
  available: { label: "Disponible", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  reserved: { label: "Réservé", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  sold: { label: "Vendu", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
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

export default function KnowledgePage() {
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const { toast } = useToast();

  const [newVehicle, setNewVehicle] = useState({
    reference: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    fuel: "gasoline",
    transmission: "manual",
    mileage: 0,
    price: 0,
    color: "",
    status: "available",
    description: "",
    aiUsable: true,
  });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const { data: knowledgeItems = [] } = useQuery<KnowledgeItem[]>({
    queryKey: ["/api/knowledge"],
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (vehicle: typeof newVehicle) => {
      const res = await apiRequest("POST", "/api/vehicles", vehicle);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsAddVehicleOpen(false);
      setNewVehicle({
        reference: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        fuel: "gasoline",
        transmission: "manual",
        mileage: 0,
        price: 0,
        color: "",
        status: "available",
        description: "",
        aiUsable: true,
      });
      toast({ title: "Véhicule ajouté", description: "Le véhicule a été ajouté au stock." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible d'ajouter le véhicule.", variant: "destructive" });
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vehicle> }) => {
      const res = await apiRequest("PATCH", `/api/vehicles/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      toast({ title: "Véhicule mis à jour" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de modifier le véhicule.", variant: "destructive" });
    },
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.brand.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      vehicle.reference.toLowerCase().includes(vehicleSearch.toLowerCase());
    const matchesStatus = vehicleStatusFilter === "all" || vehicle.status === vehicleStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getKnowledgeByCategory = (category: string) => {
    return knowledgeItems.filter((item) => item.category === category);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Base IA</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Informations utilisées par l'agent IA pour répondre aux clients
        </p>
      </div>

      <Tabs defaultValue="info" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="info" data-testid="tab-info">
            <Building2 className="h-4 w-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="vehicles" data-testid="tab-vehicles">
            <Car className="h-4 w-4 mr-2" />
            Véhicules
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Informations concession</h2>
                <Button
                  variant={isEditingInfo ? "default" : "outline"}
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  data-testid="button-edit-info"
                >
                  {isEditingInfo ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              </div>

              <Accordion type="multiple" defaultValue={["hours", "contact", "procedures"]} className="space-y-2">
                <AccordionItem value="hours" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Horaires d'ouverture</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-3">
                      {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((day) => (
                        <div key={day} className="flex items-center justify-between">
                          <span className="text-sm">{day}</span>
                          {isEditingInfo ? (
                            <div className="flex items-center gap-2">
                              <Input className="w-24 h-8" defaultValue="09:00" data-testid={`input-open-${day.toLowerCase()}`} />
                              <span>-</span>
                              <Input className="w-24 h-8" defaultValue="18:00" data-testid={`input-close-${day.toLowerCase()}`} />
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {day === "Dimanche" ? "Fermé" : "09:00 - 18:00"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contact" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Coordonnées</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Adresse</Label>
                          {isEditingInfo ? (
                            <Textarea
                              defaultValue="123 Avenue des Voitures\n75001 Paris"
                              className="min-h-[80px]"
                              data-testid="input-address"
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              123 Avenue des Voitures<br />75001 Paris
                            </p>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Téléphone vente</Label>
                            {isEditingInfo ? (
                              <Input defaultValue="01 23 45 67 89" data-testid="input-phone-sales" />
                            ) : (
                              <p className="text-sm text-muted-foreground">01 23 45 67 89</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label>Email vente</Label>
                            {isEditingInfo ? (
                              <Input defaultValue="vente@autoconcession.fr" data-testid="input-email-sales" />
                            ) : (
                              <p className="text-sm text-muted-foreground">vente@autoconcession.fr</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="procedures" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Procédures</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      {["Essai véhicule", "Reprise véhicule", "Financement", "Livraison"].map((procedure) => (
                        <div key={procedure} className="space-y-2">
                          <Label>{procedure}</Label>
                          {isEditingInfo ? (
                            <Textarea
                              placeholder={`Décrivez la procédure de ${procedure.toLowerCase()}...`}
                              className="min-h-[60px]"
                              data-testid={`input-procedure-${procedure.toLowerCase().replace(" ", "-")}`}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Non défini
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">FAQ</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <Button variant="outline" size="sm" data-testid="button-add-faq">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une question
                      </Button>
                      <div className="space-y-3">
                        <Card>
                          <CardContent className="pt-4">
                            <p className="font-medium text-sm">Quels sont vos modes de paiement acceptés ?</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Nous acceptons les paiements par carte bancaire, virement, chèque et financement.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ai-rules" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Règles IA</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Ton de réponse</Label>
                        {isEditingInfo ? (
                          <Select defaultValue="professional">
                            <SelectTrigger data-testid="select-tone">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="professional">Professionnel</SelectItem>
                              <SelectItem value="friendly">Amical</SelectItem>
                              <SelectItem value="formal">Formel</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-muted-foreground">Professionnel</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Signature email</Label>
                        {isEditingInfo ? (
                          <Textarea
                            defaultValue="L'équipe AutoConcession"
                            className="min-h-[60px]"
                            data-testid="input-signature"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">L'équipe AutoConcession</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Cas nécessitant réponse humaine</Label>
                        {isEditingInfo ? (
                          <Textarea
                            placeholder="Ex: Négociation de prix, réclamation, demande de reprise..."
                            className="min-h-[80px]"
                            data-testid="input-human-cases"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Négociation de prix, réclamation, demande de reprise
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="vehicles" className="flex-1 m-0 flex flex-col overflow-hidden">
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un véhicule..."
                    className="pl-9"
                    value={vehicleSearch}
                    onChange={(e) => setVehicleSearch(e.target.value)}
                    data-testid="input-search-vehicles"
                  />
                </div>
                <Select value={vehicleStatusFilter} onValueChange={setVehicleStatusFilter}>
                  <SelectTrigger className="w-36" data-testid="select-vehicle-status">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="reserved">Réservé</SelectItem>
                    <SelectItem value="sold">Vendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-add-vehicle">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un véhicule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Nouveau véhicule</DialogTitle>
                    <DialogDescription>
                      Ajouter un véhicule au stock
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence *</Label>
                      <Input 
                        id="reference" 
                        placeholder="REF-001" 
                        value={newVehicle.reference}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, reference: e.target.value }))}
                        data-testid="input-vehicle-ref" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marque *</Label>
                      <Input 
                        id="brand" 
                        placeholder="Peugeot" 
                        value={newVehicle.brand}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, brand: e.target.value }))}
                        data-testid="input-vehicle-brand" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modèle *</Label>
                      <Input 
                        id="model" 
                        placeholder="3008" 
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, model: e.target.value }))}
                        data-testid="input-vehicle-model" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Année *</Label>
                      <Input 
                        id="year" 
                        type="number" 
                        placeholder="2023" 
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, year: parseInt(e.target.value) || 0 }))}
                        data-testid="input-vehicle-year" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuel">Énergie *</Label>
                      <Select value={newVehicle.fuel} onValueChange={(val) => setNewVehicle((v) => ({ ...v, fuel: val }))}>
                        <SelectTrigger data-testid="select-vehicle-fuel">
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
                      <Label htmlFor="transmission">Boîte *</Label>
                      <Select value={newVehicle.transmission} onValueChange={(val) => setNewVehicle((v) => ({ ...v, transmission: val }))}>
                        <SelectTrigger data-testid="select-vehicle-transmission">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manuelle</SelectItem>
                          <SelectItem value="automatic">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Kilométrage *</Label>
                      <Input 
                        id="mileage" 
                        type="number" 
                        placeholder="15000" 
                        value={newVehicle.mileage}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, mileage: parseInt(e.target.value) || 0 }))}
                        data-testid="input-vehicle-mileage" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (€) *</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="25000" 
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, price: parseInt(e.target.value) || 0 }))}
                        data-testid="input-vehicle-price" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Couleur</Label>
                      <Input 
                        id="color" 
                        placeholder="Noir" 
                        value={newVehicle.color}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, color: e.target.value }))}
                        data-testid="input-vehicle-color" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Statut</Label>
                      <Select value={newVehicle.status} onValueChange={(val) => setNewVehicle((v) => ({ ...v, status: val }))}>
                        <SelectTrigger data-testid="select-vehicle-status-add">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="reserved">Réservé</SelectItem>
                          <SelectItem value="sold">Vendu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Description du véhicule..." 
                        value={newVehicle.description}
                        onChange={(e) => setNewVehicle((v) => ({ ...v, description: e.target.value }))}
                        data-testid="input-vehicle-description" 
                      />
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <Switch 
                        id="aiUsable" 
                        checked={newVehicle.aiUsable}
                        onCheckedChange={(checked) => setNewVehicle((v) => ({ ...v, aiUsable: checked }))}
                        data-testid="switch-ai-usable" 
                      />
                      <Label htmlFor="aiUsable">Utilisable par l'IA</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={() => createVehicleMutation.mutate(newVehicle)}
                      disabled={createVehicleMutation.isPending || !newVehicle.reference || !newVehicle.brand || !newVehicle.model}
                      data-testid="button-submit-vehicle"
                    >
                      {createVehicleMutation.isPending ? "Ajout..." : "Ajouter le véhicule"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? "s" : ""}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-emerald-600 dark:text-emerald-400">
                {vehicles.filter((v) => v.status === "available").length} disponible{vehicles.filter((v) => v.status === "available").length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            {vehiclesLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Chargement des véhicules...
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="p-8 text-center">
                <Car className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Aucun véhicule en stock</p>
                <p className="text-sm text-muted-foreground/75 mt-1">
                  Ajoutez des véhicules pour que l'IA puisse les proposer
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Véhicule</TableHead>
                    <TableHead>Année</TableHead>
                    <TableHead>Énergie</TableHead>
                    <TableHead>Km</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>IA</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => {
                    const status = statusConfig[vehicle.status as keyof typeof statusConfig];
                    return (
                      <TableRow
                        key={vehicle.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedVehicle(vehicle)}
                        data-testid={`vehicle-row-${vehicle.id}`}
                      >
                        <TableCell className="font-mono text-sm">{vehicle.reference}</TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                            {vehicle.color && (
                              <span className="text-muted-foreground ml-2 text-sm">{vehicle.color}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>{fuelLabels[vehicle.fuel] || vehicle.fuel}</TableCell>
                        <TableCell>{vehicle.mileage.toLocaleString()} km</TableCell>
                        <TableCell className="font-medium">{vehicle.price.toLocaleString()} €</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status?.className}>
                            {status?.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {vehicle.aiUsable ? (
                            <Eye className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" data-testid={`button-vehicle-actions-${vehicle.id}`}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedVehicle(vehicle)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateVehicleMutation.mutate({ id: vehicle.id, data: { status: "sold" } })}
                                data-testid={`button-mark-sold-${vehicle.id}`}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Marquer vendu
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => updateVehicleMutation.mutate({ id: vehicle.id, data: { aiUsable: !vehicle.aiUsable } })}
                                data-testid={`button-toggle-ai-${vehicle.id}`}
                              >
                                {vehicle.aiUsable ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {vehicle.aiUsable ? "Masquer de l'IA" : "Afficher à l'IA"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => updateVehicleMutation.mutate({ id: vehicle.id, data: { status: "reserved" } })}
                                data-testid={`button-reserve-${vehicle.id}`}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Marquer réservé
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {selectedVehicle && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedVehicle.brand} {selectedVehicle.model}
                <Badge variant="outline" className={statusConfig[selectedVehicle.status as keyof typeof statusConfig]?.className}>
                  {statusConfig[selectedVehicle.status as keyof typeof statusConfig]?.label}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Réf: {selectedVehicle.reference}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Année</p>
                    <p className="font-medium">{selectedVehicle.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Énergie</p>
                    <p className="font-medium">{fuelLabels[selectedVehicle.fuel]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Boîte</p>
                    <p className="font-medium">{transmissionLabels[selectedVehicle.transmission]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Kilométrage</p>
                    <p className="font-medium">{selectedVehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prix</p>
                    <p className="font-medium">{selectedVehicle.price.toLocaleString()} €</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Couleur</p>
                    <p className="font-medium">{selectedVehicle.color || "—"}</p>
                  </div>
                </div>
              </div>
              {selectedVehicle.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Description</p>
                    <p className="text-sm">{selectedVehicle.description}</p>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {selectedVehicle.aiUsable ? (
                    <Eye className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">
                    {selectedVehicle.aiUsable ? "Visible par l'IA" : "Masqué à l'IA"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Ajouté le {selectedVehicle.createdAt
                    ? format(new Date(selectedVehicle.createdAt), "d MMMM yyyy", { locale: fr })
                    : "—"}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVehicle(null)}>
                Fermer
              </Button>
              <Button data-testid="button-edit-vehicle">
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
