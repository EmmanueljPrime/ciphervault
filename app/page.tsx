"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Lock, Unlock, Copy, QrCode, Key, Eye, EyeOff, Download, Zap, Terminal, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"
import CryptoJS from "crypto-js"

interface CipherResult {
  result: string
  algorithm: string
  key: string
  timestamp: string
}

export default function CipherVault() {
  const [inputText, setInputText] = useState("")
  const [key, setKey] = useState("")
  const [algorithm, setAlgorithm] = useState("caesar")
  const [result, setResult] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isEncrypting, setIsEncrypting] = useState(true)
  const [history, setHistory] = useState<CipherResult[]>([])
  const [autoGenKey, setAutoGenKey] = useState(false)
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("cipher")

  // Algorithme César
  const caesarCipher = (text: string, shift: number, decrypt = false): string => {
    const actualShift = decrypt ? -shift : shift
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97
      return String.fromCharCode(((char.charCodeAt(0) - start + actualShift + 26) % 26) + start)
    })
  }

  // Algorithme Vigenère
  const vigenereCipher = (text: string, key: string, decrypt = false): string => {
    if (!key) return text
    const keyRepeated = key.repeat(Math.ceil(text.length / key.length))

    return text
      .split("")
      .map((char, i) => {
        if (!/[a-zA-Z]/.test(char)) return char

        const charCode = char.charCodeAt(0)
        const keyChar = keyRepeated[i].toLowerCase()
        const keyShift = keyChar.charCodeAt(0) - 97
        const shift = decrypt ? -keyShift : keyShift

        if (char >= "A" && char <= "Z") {
          return String.fromCharCode(((charCode - 65 + shift + 26) % 26) + 65)
        } else {
          return String.fromCharCode(((charCode - 97 + shift + 26) % 26) + 97)
        }
      })
      .join("")
  }

  // Algorithme XOR
  const xorCipher = (text: string, key: string): string => {
    if (!key) return text
    const keyRepeated = key.repeat(Math.ceil(text.length / key.length))

    return text
      .split("")
      .map((char, i) => {
        const charCode = char.charCodeAt(0)
        const keyCode = keyRepeated[i % keyRepeated.length].charCodeAt(0)
        return String.fromCharCode(charCode ^ keyCode)
      })
      .join("")
  }

  // Algorithme AES
  const aesCipher = (text: string, key: string, decrypt = false): string => {
    try {
      if (decrypt) {
        const bytes = CryptoJS.AES.decrypt(text, key)
        return bytes.toString(CryptoJS.enc.Utf8)
      } else {
        return CryptoJS.AES.encrypt(text, key).toString()
      }
    } catch (error) {
      throw new Error("Erreur AES: Clé invalide ou texte corrompu")
    }
  }

  // Base64
  const base64Cipher = (text: string, decrypt = false): string => {
    try {
      if (decrypt) {
        return atob(text)
      } else {
        return btoa(text)
      }
    } catch (error) {
      throw new Error("Erreur Base64: Texte invalide")
    }
  }

  // ROT13
  const rot13Cipher = (text: string): string => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= "Z" ? 65 : 97
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
    })
  }

  // Génération de clé automatique
  const generateKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let result = ""
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setKey(result)
  }

  // Fonction principale de chiffrement/déchiffrement
  const processText = () => {
    if (!inputText.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un texte à traiter",
        variant: "destructive",
      })
      return
    }

    try {
      let processedText = ""
      const needsKey = !["base64", "rot13"].includes(algorithm)

      if (needsKey && !key.trim()) {
        toast({
          title: "Erreur",
          description: "Une clé est requise pour cet algorithme",
          variant: "destructive",
        })
        return
      }

      switch (algorithm) {
        case "caesar":
          const shift = Number.parseInt(key) || 3
          processedText = caesarCipher(inputText, shift, !isEncrypting)
          break
        case "vigenere":
          processedText = vigenereCipher(inputText, key, !isEncrypting)
          break
        case "xor":
          processedText = xorCipher(inputText, key)
          break
        case "aes":
          processedText = aesCipher(inputText, key, !isEncrypting)
          break
        case "base64":
          processedText = base64Cipher(inputText, !isEncrypting)
          break
        case "rot13":
          processedText = rot13Cipher(inputText)
          break
        default:
          throw new Error("Algorithme non supporté")
      }

      setResult(processedText)

      // Ajouter à l'historique
      const newEntry: CipherResult = {
        result: processedText,
        algorithm: algorithm.toUpperCase(),
        key: needsKey ? key : "N/A",
        timestamp: new Date().toLocaleString(),
      }
      setHistory((prev) => [newEntry, ...prev.slice(0, 9)]) // Garder les 10 derniers

      toast({
        title: "Succès",
        description: `Texte ${isEncrypting ? "chiffré" : "déchiffré"} avec succès`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur de traitement",
        variant: "destructive",
      })
    }
  }

  // Génération du QR Code
  const generateQRCode = async () => {
    if (!result) {
      toast({
        title: "Erreur",
        description: "Aucun résultat à encoder en QR Code",
        variant: "destructive",
      })
      return
    }

    try {
      const qrUrl = await QRCode.toDataURL(result, {
        width: 256,
        margin: 2,
        color: {
          dark: "#00ff88",
          light: "#0a0a0a",
        },
      })
      setQrCodeUrl(qrUrl)
      setActiveTab("qr") // Changer vers l'onglet QR Code
      toast({
        title: "QR Code généré",
        description: "Le QR Code a été créé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur QR Code",
        description: "Impossible de générer le QR Code",
        variant: "destructive",
      })
    }
  }

  // Copier dans le presse-papiers
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copié !",
      description: `${type} copié dans le presse-papiers`,
    })
  }

  // Télécharger le QR Code
  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `cipher-qr-${Date.now()}.png`
    link.href = qrCodeUrl
    link.click()
  }

  // Auto-génération de clé
  useEffect(() => {
    if (autoGenKey && ["caesar", "vigenere", "xor", "aes"].includes(algorithm)) {
      generateKey()
    }
  }, [algorithm, autoGenKey])

  const getAlgorithmInfo = (algo: string) => {
    const info = {
      caesar: { name: "César", desc: "Décalage alphabétique simple", security: "Faible", keyType: "Nombre" },
      vigenere: { name: "Vigenère", desc: "Chiffrement polyalphabétique", security: "Moyen", keyType: "Texte" },
      xor: { name: "XOR", desc: "Opération bit à bit", security: "Variable", keyType: "Texte" },
      aes: { name: "AES", desc: "Standard de chiffrement avancé", security: "Très fort", keyType: "Texte" },
      base64: { name: "Base64", desc: "Encodage (pas de chiffrement)", security: "Aucune", keyType: "Aucune" },
      rot13: { name: "ROT13", desc: "Rotation de 13 caractères", security: "Aucune", keyType: "Aucune" },
    }
    return info[algo as keyof typeof info] || info.caesar
  }

  const currentAlgoInfo = getAlgorithmInfo(algorithm)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl">
              <Shield className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent font-mono">
              CipherVault
            </h1>
          </div>
          <p className="text-green-300 text-lg font-mono">
            {">"} Chiffrement & Déchiffrement Sécurisé {"<"}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Terminal className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm font-mono">SYSTÈME CRYPTOGRAPHIQUE ACTIF</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-green-500/20">
            <TabsTrigger
              value="cipher"
              className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Lock className="h-4 w-4" />
              Chiffrement
            </TabsTrigger>
            <TabsTrigger
              value="qr"
              className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <QrCode className="h-4 w-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
            >
              <Code className="h-4 w-4" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cipher" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Configuration */}
              <Card className="bg-gray-800 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2 font-mono">
                    <Key className="h-5 w-5" />
                    Configuration
                  </CardTitle>
                  <CardDescription className="text-green-300/70">Paramètres de chiffrement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mode */}
                  <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2">
                      {isEncrypting ? (
                        <Lock className="h-4 w-4 text-green-400" />
                      ) : (
                        <Unlock className="h-4 w-4 text-cyan-400" />
                      )}
                      <span className="text-green-300 font-mono">{isEncrypting ? "CHIFFREMENT" : "DÉCHIFFREMENT"}</span>
                    </div>
                    <Switch
                      checked={isEncrypting}
                      onCheckedChange={setIsEncrypting}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>

                  {/* Algorithme */}
                  <div className="space-y-2">
                    <Label className="text-green-300 font-mono">Algorithme</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger className="bg-gray-900 border-green-500/20 text-green-300 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-green-500/20">
                        <SelectItem value="caesar">César (Décalage)</SelectItem>
                        <SelectItem value="vigenere">Vigenère (Polyalphabétique)</SelectItem>
                        <SelectItem value="xor">XOR (Bit à bit)</SelectItem>
                        <SelectItem value="aes">AES (Avancé)</SelectItem>
                        <SelectItem value="base64">Base64 (Encodage)</SelectItem>
                        <SelectItem value="rot13">ROT13 (Rotation)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Info algorithme */}
                  <div className="p-3 bg-gray-900 rounded-lg border border-green-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-green-400 font-mono font-bold">{currentAlgoInfo.name}</h4>
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${
                          currentAlgoInfo.security === "Très fort"
                            ? "border-green-500 text-green-400"
                            : currentAlgoInfo.security === "Fort"
                              ? "border-blue-500 text-blue-400"
                              : currentAlgoInfo.security === "Moyen"
                                ? "border-yellow-500 text-yellow-400"
                                : currentAlgoInfo.security === "Faible"
                                  ? "border-orange-500 text-orange-400"
                                  : "border-red-500 text-red-400"
                        }`}
                      >
                        {currentAlgoInfo.security}
                      </Badge>
                    </div>
                    <p className="text-green-300/70 text-sm mb-2">{currentAlgoInfo.desc}</p>
                    <p className="text-green-300/50 text-xs font-mono">Clé: {currentAlgoInfo.keyType}</p>
                  </div>

                  {/* Clé */}
                  {!["base64", "rot13"].includes(algorithm) && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-green-300 font-mono">Clé de chiffrement</Label>
                        <div className="flex items-center gap-2">
                          <Label className="text-green-300/70 text-xs">Auto</Label>
                          <Switch
                            checked={autoGenKey}
                            onCheckedChange={setAutoGenKey}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        <Input
                          value={key}
                          onChange={(e) => setKey(e.target.value)}
                          type={showKey ? "text" : "password"}
                          placeholder={algorithm === "caesar" ? "Nombre (ex: 3)" : "Votre clé secrète..."}
                          className="bg-gray-900 border-green-500/20 text-green-300 font-mono pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowKey(!showKey)}
                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          >
                            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={generateKey}
                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Texte d'entrée */}
                  <div className="space-y-2">
                    <Label className="text-green-300 font-mono">
                      Texte à {isEncrypting ? "chiffrer" : "déchiffrer"}
                    </Label>
                    <Textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Saisissez votre texte ici..."
                      className="bg-gray-900 border-green-500/20 text-green-300 font-mono min-h-[120px] resize-none"
                    />
                    <p className="text-green-300/50 text-xs font-mono">{inputText.length} caractères</p>
                  </div>

                  <Button
                    onClick={processText}
                    className="w-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-mono font-bold"
                  >
                    {isEncrypting ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
                    {isEncrypting ? "CHIFFRER" : "DÉCHIFFRER"}
                  </Button>
                </CardContent>
              </Card>

              {/* Résultat */}
              <Card className="bg-gray-800 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2 font-mono">
                    <Terminal className="h-5 w-5" />
                    Résultat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={result}
                      readOnly
                      placeholder="Le résultat apparaîtra ici..."
                      className="bg-gray-900 border-green-500/20 text-green-300 font-mono min-h-[200px] resize-none"
                    />
                    {result && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(result, "Résultat")}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {result && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(result, "Résultat")}
                        variant="outline"
                        className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/20 font-mono"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                      <Button
                        onClick={generateQRCode}
                        variant="outline"
                        className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/20 font-mono bg-transparent"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </Button>
                    </div>
                  )}

                  {result && (
                    <div className="p-3 bg-gray-900 rounded-lg border border-green-500/20">
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div>
                          <span className="text-green-300/70">Algorithme:</span>
                          <p className="text-green-400">{currentAlgoInfo.name}</p>
                        </div>
                        <div>
                          <span className="text-green-300/70">Longueur:</span>
                          <p className="text-green-400">{result.length} chars</p>
                        </div>
                        <div>
                          <span className="text-green-300/70">Mode:</span>
                          <p className="text-green-400">{isEncrypting ? "Chiffrement" : "Déchiffrement"}</p>
                        </div>
                        <div>
                          <span className="text-green-300/70">Timestamp:</span>
                          <p className="text-green-400">{new Date().toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <Card className="bg-gray-800 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2 font-mono">
                  <QrCode className="h-5 w-5" />
                  Générateur QR Code
                </CardTitle>
                <CardDescription className="text-green-300/70">
                  Convertissez votre texte chiffré en QR Code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {qrCodeUrl ? (
                  <div className="text-center space-y-4">
                    <div className="inline-block p-4 bg-gray-900 rounded-lg border border-green-500/20">
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="QR Code"
                        className="mx-auto"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={downloadQRCode}
                        className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-mono"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(qrCodeUrl, "QR Code (Data URL)")}
                        variant="outline"
                        className="border-green-500/20 text-green-400 hover:bg-green-500/20 font-mono"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier URL
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="h-16 w-16 text-green-500/50 mx-auto mb-4" />
                    <p className="text-green-300/70 font-mono">Chiffrez d'abord un texte, puis générez le QR Code</p>
                    <Button
                      onClick={generateQRCode}
                      disabled={!result}
                      className="mt-4 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-black font-mono disabled:opacity-50"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Générer QR Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gray-800 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2 font-mono">
                  <Code className="h-5 w-5" />
                  Historique des opérations
                </CardTitle>
                <CardDescription className="text-green-300/70">
                  Dernières opérations de chiffrement/déchiffrement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((entry, index) => (
                      <div key={index} className="p-3 bg-gray-900 rounded-lg border border-green-500/20">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="border-green-500 text-green-400 font-mono">
                            {entry.algorithm}
                          </Badge>
                          <span className="text-green-300/50 text-xs font-mono">{entry.timestamp}</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-green-300/70 text-xs font-mono">Clé:</span>
                            <p className="text-green-300 text-sm font-mono break-all">
                              {entry.key === "N/A" ? "Aucune" : entry.key}
                            </p>
                          </div>
                          <div>
                            <span className="text-green-300/70 text-xs font-mono">Résultat:</span>
                            <p className="text-green-300 text-sm font-mono break-all line-clamp-2">{entry.result}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(entry.result, "Résultat historique")}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/20 font-mono"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copier
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code className="h-16 w-16 text-green-500/50 mx-auto mb-4" />
                    <p className="text-green-300/70 font-mono">Aucune opération dans l'historique</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
