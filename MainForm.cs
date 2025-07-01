using System;
using System.IO;
using System.Windows.Forms;
using System.Drawing;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.ComTypes;
using System.Text;

namespace ShortcutCreator
{
    public partial class MainForm : Form
    {
        private Label lblPath;
        private TextBox txtPath;
        private Button btnBrowseFile;
        private Button btnBrowseFolder;
        private Button btnDetectClipboard;
        private Button btnCreateShortcut;
        private Label lblDestination;
        private RadioButton rbDesktop;
        private RadioButton rbCustom;
        private TextBox txtCustomDestination;
        private Button btnBrowseDestination;
        private Label lblStatus;
        private LinkLabel linkGitHub;

        public MainForm()
        {
            InitializeComponent();
            DetectClipboardContent();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();

            // Configuração do formulário
            this.Text = "Criador de Atalhos";
            this.Size = new Size(550, 450);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.MinimumSize = new Size(550, 450);
            this.MaximizeBox = false;
            this.FormBorderStyle = FormBorderStyle.FixedSingle;

            // Label para o caminho
            lblPath = new Label();
            lblPath.Text = "Caminho do arquivo ou diretório:";
            lblPath.Location = new Point(20, 20);
            lblPath.Size = new Size(200, 20);
            this.Controls.Add(lblPath);

            // TextBox para o caminho
            txtPath = new TextBox();
            txtPath.Location = new Point(20, 45);
            txtPath.Size = new Size(400, 25);
            txtPath.TextChanged += TxtPath_TextChanged;
            this.Controls.Add(txtPath);

            // Botão para selecionar arquivo
            btnBrowseFile = new Button();
            btnBrowseFile.Text = "Selecionar Arquivo";
            btnBrowseFile.Location = new Point(430, 45);
            btnBrowseFile.Size = new Size(100, 25);
            btnBrowseFile.Click += BtnBrowseFile_Click;
            this.Controls.Add(btnBrowseFile);

            // Botão para selecionar pasta
            btnBrowseFolder = new Button();
            btnBrowseFolder.Text = "Selecionar Pasta";
            btnBrowseFolder.Location = new Point(20, 80);
            btnBrowseFolder.Size = new Size(100, 30);
            btnBrowseFolder.Click += BtnBrowseFolder_Click;
            this.Controls.Add(btnBrowseFolder);

            // Botão para detectar área de transferência
            btnDetectClipboard = new Button();
            btnDetectClipboard.Text = "Detectar da Área de Transferência";
            btnDetectClipboard.Location = new Point(130, 80);
            btnDetectClipboard.Size = new Size(200, 30);
            btnDetectClipboard.Click += BtnDetectClipboard_Click;
            this.Controls.Add(btnDetectClipboard);

            // Label para destino
            lblDestination = new Label();
            lblDestination.Text = "Destino do atalho:";
            lblDestination.Location = new Point(20, 130);
            lblDestination.Size = new Size(150, 20);
            this.Controls.Add(lblDestination);

            // RadioButton para Área de Trabalho
            rbDesktop = new RadioButton();
            rbDesktop.Text = "Área de Trabalho";
            rbDesktop.Location = new Point(20, 155);
            rbDesktop.Size = new Size(150, 20);
            rbDesktop.Checked = true;
            rbDesktop.CheckedChanged += RbDestination_CheckedChanged;
            this.Controls.Add(rbDesktop);

            // RadioButton para destino personalizado
            rbCustom = new RadioButton();
            rbCustom.Text = "Destino personalizado:";
            rbCustom.Location = new Point(20, 185);
            rbCustom.Size = new Size(150, 20);
            rbCustom.CheckedChanged += RbDestination_CheckedChanged;
            this.Controls.Add(rbCustom);

            // TextBox para destino personalizado
            txtCustomDestination = new TextBox();
            txtCustomDestination.Location = new Point(20, 210);
            txtCustomDestination.Size = new Size(400, 25);
            txtCustomDestination.Enabled = false;
            this.Controls.Add(txtCustomDestination);

            // Botão para selecionar destino personalizado
            btnBrowseDestination = new Button();
            btnBrowseDestination.Text = "Selecionar";
            btnBrowseDestination.Location = new Point(430, 210);
            btnBrowseDestination.Size = new Size(100, 25);
            btnBrowseDestination.Enabled = false;
            btnBrowseDestination.Click += BtnBrowseDestination_Click;
            this.Controls.Add(btnBrowseDestination);

            // Botão para criar atalho
            btnCreateShortcut = new Button();
            btnCreateShortcut.Text = "Criar Atalho";
            btnCreateShortcut.Location = new Point(20, 260);
            btnCreateShortcut.Size = new Size(120, 35);
            btnCreateShortcut.BackColor = Color.LightBlue;
            btnCreateShortcut.Font = new Font(btnCreateShortcut.Font, FontStyle.Bold);
            btnCreateShortcut.Click += BtnCreateShortcut_Click;
            btnCreateShortcut.Enabled = false;
            this.Controls.Add(btnCreateShortcut);

            // Link para o GitHub
            linkGitHub = new LinkLabel();
            linkGitHub.Text = "🔗 Ver no GitHub";
            linkGitHub.Location = new Point(430, 270);
            linkGitHub.Size = new Size(100, 20);
            linkGitHub.LinkClicked += LinkGitHub_LinkClicked;
            this.Controls.Add(linkGitHub);

            // Label para status
            lblStatus = new Label();
            lblStatus.Location = new Point(20, 310);
            lblStatus.Size = new Size(500, 40);
            lblStatus.ForeColor = Color.Blue;
            lblStatus.Text = "Aguardando seleção...";
            this.Controls.Add(lblStatus);

            this.ResumeLayout(false);
        }

        private void TxtPath_TextChanged(object sender, EventArgs e)
        {
            ValidateInput();
        }

        private void RbDestination_CheckedChanged(object sender, EventArgs e)
        {
            txtCustomDestination.Enabled = rbCustom.Checked;
            btnBrowseDestination.Enabled = rbCustom.Checked;
            ValidateInput();
        }

        private void BtnBrowseFile_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog openFileDialog = new OpenFileDialog())
            {
                openFileDialog.Title = "Selecionar arquivo";
                openFileDialog.Filter = "Todos os arquivos (*.*)|*.*";
                
                if (openFileDialog.ShowDialog() == DialogResult.OK)
                {
                    txtPath.Text = openFileDialog.FileName;
                    lblStatus.Text = "Arquivo selecionado com sucesso.";
                    lblStatus.ForeColor = Color.Green;
                }
            }
        }

        private void BtnBrowseFolder_Click(object sender, EventArgs e)
        {
            using (FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog())
            {
                folderBrowserDialog.Description = "Selecionar pasta";
                folderBrowserDialog.ShowNewFolderButton = true;
                
                if (folderBrowserDialog.ShowDialog() == DialogResult.OK)
                {
                    txtPath.Text = folderBrowserDialog.SelectedPath;
                    lblStatus.Text = "Pasta selecionada com sucesso.";
                    lblStatus.ForeColor = Color.Green;
                }
            }
        }

        private void BtnDetectClipboard_Click(object sender, EventArgs e)
        {
            DetectClipboardContent();
        }

        private void DetectClipboardContent()
        {
            try
            {
                if (Clipboard.ContainsText())
                {
                    string clipboardText = Clipboard.GetText().Trim();
                    
                    // Verifica se o texto é um caminho válido
                    if (File.Exists(clipboardText) || Directory.Exists(clipboardText))
                    {
                        txtPath.Text = clipboardText;
                        lblStatus.Text = "Caminho detectado da área de transferência.";
                        lblStatus.ForeColor = Color.Green;
                    }
                    else
                    {
                        lblStatus.Text = "Área de transferência não contém um caminho válido.";
                        lblStatus.ForeColor = Color.Orange;
                    }
                }
                else
                {
                    lblStatus.Text = "Área de transferência não contém texto.";
                    lblStatus.ForeColor = Color.Orange;
                }
            }
            catch (Exception ex)
            {
                lblStatus.Text = $"Erro ao acessar área de transferência: {ex.Message}";
                lblStatus.ForeColor = Color.Red;
            }
        }

        private void BtnBrowseDestination_Click(object sender, EventArgs e)
        {
            using (FolderBrowserDialog folderBrowserDialog = new FolderBrowserDialog())
            {
                folderBrowserDialog.Description = "Selecionar destino do atalho";
                folderBrowserDialog.ShowNewFolderButton = true;
                
                if (folderBrowserDialog.ShowDialog() == DialogResult.OK)
                {
                    txtCustomDestination.Text = folderBrowserDialog.SelectedPath;
                    ValidateInput();
                }
            }
        }

        private void ValidateInput()
        {
            bool isValidPath = !string.IsNullOrWhiteSpace(txtPath.Text) && 
                              (File.Exists(txtPath.Text) || Directory.Exists(txtPath.Text));
            
            bool isValidDestination = rbDesktop.Checked || 
                                     (rbCustom.Checked && Directory.Exists(txtCustomDestination.Text));

            btnCreateShortcut.Enabled = isValidPath && isValidDestination;

            if (!isValidPath && !string.IsNullOrWhiteSpace(txtPath.Text))
            {
                lblStatus.Text = "Caminho inválido ou não existe.";
                lblStatus.ForeColor = Color.Red;
            }
            else if (!isValidDestination && rbCustom.Checked)
            {
                lblStatus.Text = "Destino personalizado inválido.";
                lblStatus.ForeColor = Color.Red;
            }
        }

        private void BtnCreateShortcut_Click(object sender, EventArgs e)
        {
            try
            {
                string sourcePath = txtPath.Text;
                string destinationFolder = rbDesktop.Checked 
                    ? Environment.GetFolderPath(Environment.SpecialFolder.Desktop)
                    : txtCustomDestination.Text;

                string fileName = Path.GetFileNameWithoutExtension(sourcePath);
                if (string.IsNullOrEmpty(fileName))
                {
                    fileName = new DirectoryInfo(sourcePath).Name;
                }

                string shortcutPath = Path.Combine(destinationFolder, $"{fileName}.lnk");

                // Verifica se já existe um atalho com o mesmo nome
                int counter = 1;
                string originalShortcutPath = shortcutPath;
                while (File.Exists(shortcutPath))
                {
                    shortcutPath = Path.Combine(destinationFolder, $"{fileName} ({counter}).lnk");
                    counter++;
                }

                CreateShortcut(sourcePath, shortcutPath);

                lblStatus.Text = $"Atalho criado com sucesso em: {shortcutPath}";
                lblStatus.ForeColor = Color.Green;

                // Pergunta se deseja abrir a pasta do atalho
                DialogResult result = MessageBox.Show(
                    $"Atalho criado com sucesso!\n\nDeseja abrir a pasta onde o atalho foi criado?",
                    "Atalho Criado",
                    MessageBoxButtons.YesNo,
                    MessageBoxIcon.Information);

                if (result == DialogResult.Yes)
                {
                    Process.Start("explorer.exe", $"/select,\"{shortcutPath}\"");
                }
            }
            catch (Exception ex)
            {
                lblStatus.Text = $"Erro ao criar atalho: {ex.Message}";
                lblStatus.ForeColor = Color.Red;
                MessageBox.Show($"Erro ao criar atalho:\n{ex.Message}", "Erro", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void LinkGitHub_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "https://github.com/ricardopera/CriadorDeAtalhos",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erro ao abrir o link:\n{ex.Message}", "Erro", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void CreateShortcut(string sourcePath, string shortcutPath)
        {
            IShellLink link = (IShellLink)new ShellLink();
            
            // Configura o atalho
            link.SetPath(sourcePath);
            link.SetWorkingDirectory(Path.GetDirectoryName(sourcePath) ?? "");
            
            // Adiciona descrição
            string description = File.Exists(sourcePath) ? "Atalho para arquivo" : "Atalho para pasta";
            link.SetDescription($"{description}: {Path.GetFileName(sourcePath)}");

            // Salva o atalho
            IPersistFile file = (IPersistFile)link;
            file.Save(shortcutPath, false);
        }
    }

    // Interfaces COM necessárias para criar atalhos
    [ComImport]
    [Guid("00021401-0000-0000-C000-000000000046")]
    internal class ShellLink
    {
    }

    [ComImport]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    [Guid("000214F9-0000-0000-C000-000000000046")]
    internal interface IShellLink
    {
        void GetPath([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszFile, int cchMaxPath, out IntPtr pfd, int fFlags);
        void GetIDList(out IntPtr ppidl);
        void SetIDList(IntPtr pidl);
        void GetDescription([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszName, int cchMaxName);
        void SetDescription([MarshalAs(UnmanagedType.LPWStr)] string pszName);
        void GetWorkingDirectory([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszDir, int cchMaxPath);
        void SetWorkingDirectory([MarshalAs(UnmanagedType.LPWStr)] string pszDir);
        void GetArguments([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszArgs, int cchMaxArgs);
        void SetArguments([MarshalAs(UnmanagedType.LPWStr)] string pszArgs);
        void GetHotkey(out short pwHotkey);
        void SetHotkey(short wHotkey);
        void GetShowCmd(out int piShowCmd);
        void SetShowCmd(int iShowCmd);
        void GetIconLocation([Out, MarshalAs(UnmanagedType.LPWStr)] StringBuilder pszIconPath, int cchIconPath, out int piIcon);
        void SetIconLocation([MarshalAs(UnmanagedType.LPWStr)] string pszIconPath, int iIcon);
        void SetRelativePath([MarshalAs(UnmanagedType.LPWStr)] string pszPathRel, int dwReserved);
        void Resolve(IntPtr hwnd, int fFlags);
        void SetPath([MarshalAs(UnmanagedType.LPWStr)] string pszFile);
    }
}