import React from 'react'

type HtmlModalProps = {
  htmlContent: string
  onClose: () => void
}

const HtmlModal: React.FC<HtmlModalProps> = ({ htmlContent, onClose }) => {
  return (
    <div
      className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose} // Обработчик клика для закрытия окна
    >
      {/* Используем stopPropagation, чтобы клик по контенту не закрывал окно */}
      <div
        className="bg-gray-800 p-6 rounded-lg max-w-[70vw] w-full overflow-y-auto max-h-[90vh] overscroll-contain"
        onClick={(e) => e.stopPropagation()} // Останавливаем всплытие события
      >
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="bg-gray-800 text-white" />
      </div>
    </div>
  )
}

export default HtmlModal
