using System;
using System.Windows.Forms;

namespace ShortcutCreator
{
    internal static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            // Configuração para aplicações Windows Forms modernas
            Application.SetHighDpiMode(HighDpiMode.SystemAware);
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            
            // Inicia a aplicação
            Application.Run(new MainForm());
        }
    }
}