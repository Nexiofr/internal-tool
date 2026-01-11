import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import {
  BarChart3,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Bot,
  User,
  Download,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import type { DailyStats } from "@shared/schema";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon: React.ReactNode;
  variant?: "default" | "success" | "warning";
}

function StatCard({ title, value, description, trend, icon, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "",
    success: "border-emerald-500/20 bg-emerald-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
  };

  return (
    <Card className={variantStyles[variant]}>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="p-2 rounded-md bg-muted/50">{icon}</div>
            {trend !== undefined && (
              <div className={`flex items-center text-xs ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {trend >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-0.5" />
                )}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const escalationReasons = [
  { reason: "Négociation de prix", count: 45, percentage: 32 },
  { reason: "Demande de reprise", count: 28, percentage: 20 },
  { reason: "Question technique spécifique", count: 22, percentage: 16 },
  { reason: "Réclamation", count: 18, percentage: 13 },
  { reason: "Financement complexe", count: 15, percentage: 11 },
  { reason: "Autre", count: 12, percentage: 8 },
];

const sellerStats = [
  { name: "Jean Dupont", emails: 45, avgTime: "2h 15min", conversions: 8 },
  { name: "Marie Martin", emails: 38, avgTime: "1h 45min", conversions: 12 },
  { name: "Pierre Durand", emails: 32, avgTime: "3h 20min", conversions: 5 },
  { name: "Sophie Bernard", emails: 28, avgTime: "2h 00min", conversions: 7 },
];

export default function StatisticsPage() {
  const [period, setPeriod] = useState<string>("week");
  const [sellerFilter, setSellerFilter] = useState<string>("all");

  const { data: stats = [] } = useQuery<DailyStats[]>({
    queryKey: ["/api/statistics", period],
  });

  const totalEmails = 156;
  const aiResponses = 98;
  const humanEscalations = 58;
  const avgResponseTime = "2h 15min";
  
  const totalCalls = 234;
  const aiHandledCalls = 187;
  const transferredCalls = 47;
  const avgCallDuration = "4min 30s";

  const waitlistConversions = 15;
  const conversionRate = 12.5;

  const handleExport = () => {
    // Export functionality placeholder
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Statistiques</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Performance des automatisations email et appel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36" data-testid="select-period">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sellerFilter} onValueChange={setSellerFilter}>
              <SelectTrigger className="w-40" data-testid="select-seller">
                <User className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Vendeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les vendeurs</SelectItem>
                <SelectItem value="jean">Jean Dupont</SelectItem>
                <SelectItem value="marie">Marie Martin</SelectItem>
                <SelectItem value="pierre">Pierre Durand</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport} data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              Emails
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total reçus"
                value={totalEmails}
                description="Cette semaine"
                trend={12}
                icon={<Mail className="h-5 w-5 text-primary" />}
              />
              <StatCard
                title="Réponses IA"
                value={aiResponses}
                description={`${Math.round((aiResponses / totalEmails) * 100)}% du total`}
                trend={8}
                icon={<Bot className="h-5 w-5 text-emerald-500" />}
                variant="success"
              />
              <StatCard
                title="Escalades humain"
                value={humanEscalations}
                description={`${Math.round((humanEscalations / totalEmails) * 100)}% du total`}
                trend={-5}
                icon={<User className="h-5 w-5 text-amber-500" />}
                variant="warning"
              />
              <StatCard
                title="Temps moyen réponse"
                value={avgResponseTime}
                description="Par les vendeurs"
                trend={-15}
                icon={<Clock className="h-5 w-5 text-primary" />}
              />
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              Appels
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total appels"
                value={totalCalls}
                description="Cette semaine"
                trend={5}
                icon={<Phone className="h-5 w-5 text-primary" />}
              />
              <StatCard
                title="Traités par IA"
                value={aiHandledCalls}
                description={`${Math.round((aiHandledCalls / totalCalls) * 100)}% du total`}
                trend={10}
                icon={<Bot className="h-5 w-5 text-emerald-500" />}
                variant="success"
              />
              <StatCard
                title="Transférés humain"
                value={transferredCalls}
                description={`${Math.round((transferredCalls / totalCalls) * 100)}% du total`}
                trend={-3}
                icon={<User className="h-5 w-5 text-amber-500" />}
                variant="warning"
              />
              <StatCard
                title="Durée moyenne"
                value={avgCallDuration}
                description="Par appel"
                icon={<Clock className="h-5 w-5 text-primary" />}
              />
            </div>
          </section>

          <Separator />

          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Liste d'attente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Conversions"
                value={waitlistConversions}
                description="Cette semaine"
                trend={25}
                icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                variant="success"
              />
              <StatCard
                title="Taux de conversion"
                value={`${conversionRate}%`}
                description="De la liste d'attente"
                trend={3}
                icon={<BarChart3 className="h-5 w-5 text-primary" />}
              />
              <StatCard
                title="En attente"
                value={120}
                description="Clients actifs"
                icon={<Users className="h-5 w-5 text-primary" />}
              />
            </div>
          </section>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Motifs d'escalade
                  </CardTitle>
                  <CardDescription>
                    Raisons pour lesquelles l'IA transfère à un humain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {escalationReasons.map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.reason}</span>
                          <span className="text-muted-foreground">{item.count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Performance par vendeur
                  </CardTitle>
                  <CardDescription>
                    Statistiques individuelles cette semaine
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vendeur</TableHead>
                        <TableHead className="text-right">Emails</TableHead>
                        <TableHead className="text-right">Temps moy.</TableHead>
                        <TableHead className="text-right">Conversions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sellerStats.map((seller, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{seller.name}</TableCell>
                          <TableCell className="text-right">{seller.emails}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {seller.avgTime}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{seller.conversions}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>
          </div>

          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Évolution hebdomadaire
                </CardTitle>
                <CardDescription>
                  Tendance des emails et appels sur les 7 derniers jours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[
                    { day: "Lun", emails: 28, calls: 42 },
                    { day: "Mar", emails: 32, calls: 38 },
                    { day: "Mer", emails: 25, calls: 35 },
                    { day: "Jeu", emails: 30, calls: 40 },
                    { day: "Ven", emails: 35, calls: 45 },
                    { day: "Sam", emails: 12, calls: 20 },
                    { day: "Dim", emails: 5, calls: 8 },
                  ].map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex gap-1 items-end h-48">
                        <div
                          className="flex-1 bg-primary/80 rounded-t-sm transition-all"
                          style={{ height: `${(data.emails / 35) * 100}%` }}
                          title={`Emails: ${data.emails}`}
                        />
                        <div
                          className="flex-1 bg-chart-2/80 rounded-t-sm transition-all"
                          style={{ height: `${(data.calls / 45) * 100}%` }}
                          title={`Appels: ${data.calls}`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{data.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-primary/80" />
                    <span className="text-sm text-muted-foreground">Emails</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-chart-2/80" />
                    <span className="text-sm text-muted-foreground">Appels</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
