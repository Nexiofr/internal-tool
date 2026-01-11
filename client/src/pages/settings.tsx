import { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Download,
  Upload,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockUsers = [
  { id: "1", username: "jean.dupont", displayName: "Jean Dupont", role: "admin" },
  { id: "2", username: "marie.martin", displayName: "Marie Martin", role: "seller" },
  { id: "3", username: "pierre.durand", displayName: "Pierre Durand", role: "seller" },
  { id: "4", username: "sophie.bernard", displayName: "Sophie Bernard", role: "readonly" },
];

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  seller: "Vendeur",
  readonly: "Lecture seule",
};

const roleColors: Record<string, string> = {
  admin: "bg-primary/10 text-primary",
  seller: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  readonly: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
};

export default function SettingsPage() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    dailyDigest: true,
    escalationAlerts: true,
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérer les utilisateurs, notifications et données
        </p>
      </div>

      <Tabs defaultValue="users" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="users" data-testid="tab-users">
            <User className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="notifications" data-testid="tab-notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data" data-testid="tab-data">
            <Database className="h-4 w-4 mr-2" />
            Données
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-4xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-add-user">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Nouvel utilisateur</DialogTitle>
                      <DialogDescription>
                        Ajouter un utilisateur à l'application
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Nom d'utilisateur</Label>
                        <Input id="username" placeholder="prenom.nom" data-testid="input-username" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Nom affiché</Label>
                        <Input id="displayName" placeholder="Prénom Nom" data-testid="input-display-name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" type="password" data-testid="input-password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Rôle</Label>
                        <Select defaultValue="seller">
                          <SelectTrigger data-testid="select-role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrateur</SelectItem>
                            <SelectItem value="seller">Vendeur</SelectItem>
                            <SelectItem value="readonly">Lecture seule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                        Annuler
                      </Button>
                      <Button data-testid="button-submit-user">
                        Créer l'utilisateur
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Nom d'utilisateur</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.displayName}</TableCell>
                          <TableCell className="text-muted-foreground">{user.username}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={roleColors[user.role]}>
                              {roleLabels[user.role]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" data-testid={`button-edit-user-${user.id}`}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" data-testid={`button-delete-user-${user.id}`}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Permissions par rôle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fonctionnalité</TableHead>
                        <TableHead className="text-center">Admin</TableHead>
                        <TableHead className="text-center">Vendeur</TableHead>
                        <TableHead className="text-center">Lecture seule</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { feature: "Voir les emails", admin: true, seller: true, readonly: false },
                        { feature: "Répondre aux emails", admin: true, seller: true, readonly: false },
                        { feature: "Gérer la liste d'attente", admin: true, seller: true, readonly: false },
                        { feature: "Modifier la base IA", admin: true, seller: true, readonly: false },
                        { feature: "Gérer les véhicules", admin: true, seller: true, readonly: false },
                        { feature: "Voir les statistiques", admin: true, seller: true, readonly: true },
                        { feature: "Gérer les utilisateurs", admin: true, seller: false, readonly: false },
                        { feature: "Exporter les données", admin: true, seller: false, readonly: false },
                      ].map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.feature}</TableCell>
                          <TableCell className="text-center">
                            {row.admin ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.seller ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.readonly ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notifications" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-2xl">
              <h2 className="text-lg font-semibold">Préférences de notification</h2>

              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, emailAlerts: checked })
                      }
                      data-testid="switch-email-alerts"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, smsAlerts: checked })
                      }
                      data-testid="switch-sms-alerts"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Résumé quotidien</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir un résumé des activités chaque jour
                      </p>
                    </div>
                    <Switch
                      checked={notifications.dailyDigest}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, dailyDigest: checked })
                      }
                      data-testid="switch-daily-digest"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes d'escalade</Label>
                      <p className="text-sm text-muted-foreground">
                        Être notifié quand un email attend trop longtemps
                      </p>
                    </div>
                    <Switch
                      checked={notifications.escalationAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, escalationAlerts: checked })
                      }
                      data-testid="switch-escalation-alerts"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button data-testid="button-save-notifications">
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="data" className="flex-1 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 max-w-2xl">
              <h2 className="text-lg font-semibold">Gestion des données</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exporter les données
                  </CardTitle>
                  <CardDescription>
                    Télécharger les données de l'application au format CSV
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-export-emails">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les emails
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-export-waitlist">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter la liste d'attente
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-export-vehicles">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les véhicules
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-export-stats">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les statistiques
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Importer des données
                  </CardTitle>
                  <CardDescription>
                    Importer des véhicules ou clients depuis un fichier CSV
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-import-vehicles">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer des véhicules
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-import-clients">
                    <Upload className="h-4 w-4 mr-2" />
                    Importer des clients
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Zone de danger</CardTitle>
                  <CardDescription>
                    Actions irréversibles - à utiliser avec précaution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" data-testid="button-clear-data">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Réinitialiser toutes les données
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
