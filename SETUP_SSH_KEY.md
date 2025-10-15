# Setup SSH Key for GitHub - Complete Guide

## Step 1: Generate New SSH Key

Run this command and press **Enter** for all prompts (use default location, no passphrase for simplicity):

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

**Prompts you'll see:**
- `Enter file in which to save the key`: Press **Enter** (use default)
- `Enter passphrase`: Press **Enter** (no passphrase)
- `Enter same passphrase again`: Press **Enter**

**Alternative for older systems:**
If the above doesn't work, use RSA:
```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

---

## Step 2: Start SSH Agent

```bash
# Start the SSH agent
eval "$(ssh-agent -s)"
```

You should see: `Agent pid XXXX`

---

## Step 3: Add SSH Key to Agent

```bash
ssh-add ~/.ssh/id_ed25519
```

Or if you used RSA:
```bash
ssh-add ~/.ssh/id_rsa
```

---

## Step 4: Copy Your Public Key

### Windows (PowerShell):
```powershell
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

### Windows (Git Bash):
```bash
cat ~/.ssh/id_ed25519.pub | clip
```

### Manual Copy:
```bash
cat ~/.ssh/id_ed25519.pub
```
Then select and copy the output (starts with `ssh-ed25519`)

---

## Step 5: Add SSH Key to GitHub

1. **Go to GitHub Settings:**
   - Click your profile picture (top right)
   - Click **Settings**
   - Click **SSH and GPG keys** (left sidebar)

2. **Add New Key:**
   - Click **"New SSH key"** (green button)
   - **Title**: `VoiceOwl Project` (or any name)
   - **Key**: Paste your public key (from clipboard)
   - Click **"Add SSH key"**
   - Confirm with your GitHub password if prompted

**Direct Link:** https://github.com/settings/ssh/new

---

## Step 6: Test SSH Connection

```bash
ssh -T git@github.com
```

**First time?** You'll see:
```
The authenticity of host 'github.com' can't be established...
Are you sure you want to continue connecting (yes/no)?
```
Type: **yes** and press Enter

**Success message:**
```
Hi YOUR-USERNAME! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## Step 7: Push Your Project Using SSH

Now you can use SSH URL instead of HTTPS:

```bash
# If you haven't committed yet:
git commit -m "Initial commit: VoiceOwl Audio Transcription Service"

# Add remote with SSH URL (replace YOUR-USERNAME)
git remote add origin git@github.com:YOUR-USERNAME/voiceowl.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Quick Command Summary (Copy & Paste)

```bash
# 1. Generate SSH Key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "your-email@example.com"

# 2. Start SSH Agent
eval "$(ssh-agent -s)"

# 3. Add Key to Agent
ssh-add ~/.ssh/id_ed25519

# 4. Copy Public Key (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard

# 5. Go add the key to GitHub:
#    https://github.com/settings/ssh/new

# 6. Test Connection
ssh -T git@github.com

# 7. Push Project (replace YOUR-USERNAME)
git commit -m "Initial commit: VoiceOwl Audio Transcription Service"
git remote add origin git@github.com:YOUR-USERNAME/voiceowl.git
git branch -M main
git push -u origin main
```

---

## Troubleshooting

### Error: "Permission denied (publickey)"
✅ **Solution:**
1. Make sure you added the key to GitHub (Step 5)
2. Test: `ssh -T git@github.com`
3. Check agent: `ssh-add -l` (should show your key)
4. Re-add if needed: `ssh-add ~/.ssh/id_ed25519`

### Error: "Could not open a connection to your authentication agent"
✅ **Solution:**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

### Error: "Host key verification failed"
✅ **Solution:**
```bash
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts
```

### Want to check if your key is added to GitHub?
```bash
ssh -T git@github.com
```

### See your public key again:
```bash
cat ~/.ssh/id_ed25519.pub
```

---

## Benefits of Using SSH

✅ No password prompts when pushing/pulling  
✅ More secure than HTTPS  
✅ Faster authentication  
✅ One-time setup per machine  

---

## After Setup

Your Git URL will be:
- **SSH**: `git@github.com:YOUR-USERNAME/voiceowl.git` ✅
- ~~HTTPS~~: `https://github.com/YOUR-USERNAME/voiceowl.git`

---

## Alternative: Keep Using HTTPS

If you prefer HTTPS, no SSH key needed! Just use:

```bash
git commit -m "Initial commit: VoiceOwl Audio Transcription Service"
git remote add origin https://github.com/YOUR-USERNAME/voiceowl.git
git branch -M main
git push -u origin main
```

GitHub will ask for your username and password (or Personal Access Token).

---

**🎉 Once SSH is setup, you're ready to push!**

